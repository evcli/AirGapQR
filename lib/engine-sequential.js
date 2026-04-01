/**
 * AirGapQR Sequential Engine (Classic)
 * Simple linear paged transfer.
 */
window.EngineSequential = {
    prepare: (gzippedData, chunkSize) => {
        const metaSize = 60; const limit = 1200;
        const size = Math.min(chunkSize, Math.floor((limit - metaSize) * 0.75));
        const chunks = [];
        for (let i = 0; i < gzippedData.length; i += size) {
            const c = gzippedData.subarray(i, i + size);
            let b = ''; for (let j = 0; j < c.byteLength; j++) b += String.fromCharCode(c[j]);
            chunks.push(btoa(b));
        }
        return chunks;
    },

    getFrame: (tid, chunks, i, fileName) => {
        const total = chunks.length;
        const namePart = (i === 0) ? fileName.substring(0, 60) : "";
        return `${tid}|${total}|${i}|${namePart}|${chunks[i]}`;
    },

    parseFrame: (text) => {
        const p = text.split('|');
        if (p.length < 5) return null;
        return {
            type: 'SEQ',
            tid: p[0],
            total: parseInt(p[1]),
            idx: parseInt(p[2]),
            name: p[3],
            data: p[4]
        };
    }
};
