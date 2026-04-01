/**
 * AirGapQR Fountain Engine (LT-Code)
 * Infinite stream for high stability and non-overlapping block recovery.
 */

window.EngineFountain = {
    // Shared Utilities
    getChecksum: (b) => { let s=0; for(let i=0;i<b.length;i++) s=(s+b[i])%0xFFFF; return s; },
    toB64: (u) => { let s=''; for(let i=0;i<u.length;i++) s+=String.fromCharCode(u[i]); return btoa(s); },
    fromB64: (s) => new Uint8Array(atob(s).split('').map(c=>c.charCodeAt(0))),
    
    prng: (seed) => {
        let cur = seed >>> 0;
        return {
            next: () => { cur = (Math.imul(1103515245, cur) + 12345) & 0x7FFFFFFF; return cur; },
            getDegree: (k) => {
                const r = (Math.imul(1103515245, cur) + 12345) & 0x7FFFFFFF; cur = r;
                if (k === 1) return 1;
                const val = r / 0x80000000;
                if (val < 1/k) return 1;
                return Math.min(Math.floor(1/val), k);
            },
            getIndex: (start, range) => {
                cur = (Math.imul(1103515245, cur) + 12345) & 0x7FFFFFFF;
                return start + Math.floor((cur * range) / 0x80000000);
            }
        };
    },

    // SENDER: Prepare the initial chunks (Gzipped, padded)
    prepare: (gzippedData, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < gzippedData.length; i += chunkSize) {
            const chunkData = gzippedData.slice(i, i + chunkSize);
            const padded = new Uint8Array(chunkSize); padded.set(chunkData);
            chunks.push(padded);
        }
        return chunks;
    },

    // SENDER: Generate either a Manifest (M) or a Fountain (F) frame
    getFrame: (state) => {
        if (state.isInitialManifest) {
            const name = (state.sendMode === 'file' ? state.file.name : "message.txt");
            return `M|${state.tid}|${state.k}|${state.sessionChunkSize}|${state.compressedLength}|${state.originalSize}|${name}`;
        }

        const seed = Math.floor(Math.random() * 0xFFFFFFFF) || 1;
        const p = window.EngineFountain.prng(seed);
        const focusK = (state.rangeEnd - state.rangeStart) + 1;
        const degree = p.getDegree(focusK);
        const idxs = [];
        while(idxs.length < degree) {
            const id = p.getIndex(state.rangeStart, focusK);
            if (!idxs.includes(id)) idxs.push(id);
        }
        
        const xorBuf = new Uint8Array(state.sessionChunkSize);
        idxs.forEach(idx => { for(let j=0; j<state.sessionChunkSize; j++) xorBuf[j] ^= state.chunks[idx][j]; });
        
        const check = window.EngineFountain.getChecksum(xorBuf);
        return `F|${state.tid}|${seed}|${state.rangeStart}|${focusK}|${check}|${window.EngineFountain.toB64(xorBuf)}`;
    },

    // RECEIVER: Parse a scanned frame
    parseFrame: (text) => {
        const p = text.split('|');
        if (p[0] === 'M') {
            return {
                type: 'M', tid: p[1], k: parseInt(p[2]), blockSize: parseInt(p[3]), 
                compressedLength: parseInt(p[4]), originalSize: parseInt(p[5]), name: p[6]
            };
        } else if (p[0] === 'F') {
            return {
                type: 'F', tid: p[1], seed: parseInt(p[2]), rS: parseInt(p[3]), rL: parseInt(p[4]),
                check: parseInt(p[5]), data: window.EngineFountain.fromB64(p[6])
            };
        }
        return null;
    }
};
