const fs = require('fs').promises;

const baseTemplate = {
    "Dimensions": [
      1200,
      1370
    ],
    "BubbleDimensions": [
      28,
      13
    ],
    "Options": {
      "Marker": {
        "RelativePath": "omr_marker.jpg",
        "SheetToMarkerWidthRatio": 28
      }
    },
    "Concatenations": {},
    "Singles": [],
    "QBlocks": {}
};

const generateTemplate = async(qAmount, baseTemplate, savePath) => {
    baseTemplate.Singles = generateQuestionIds(qAmount);
    baseTemplate.QBlocks = generateQBlocks(baseTemplate.Singles);
    await saveTemplate(baseTemplate, savePath);
}

const generateQuestionIds = (qAmount) => {
    const ids = [];
    for (let i = 0; i < qAmount; i++) {
        ids.push(`q${i + 1}`);
    }
    return ids;
}

const generateQBlocks = (qIDs) => {
    const blocks = {};
    const rowPos = [110, 275, 440, 605, 770, 935]; // position of row, 0 = Q1-10, 1 = Q11-20, etc..
    const rowOffset = [0,1,2,3,4,5,6,7,8,14]; // fix row positioning for question
    let currRow = -1;

    qIDs.forEach((id, i) => {
        const spliti = i.toString().split(''); // split numbers
        const questionName = `Mc${id}`;

        if (spliti.length === 1) spliti.push(spliti[0]); // fix for 0 - 9, push as second value e.g. ['0', '0']
        const icountPerTenth = parseInt(spliti[1]); // get 0-9 constantly, not 10,11,12, etc...
        const firstCol = icountPerTenth === 0;
        
        if(icountPerTenth === 0) currRow++; // if is new tenth iteration, increment current row to go to next rowPos

        blocks[questionName] = {
            "qType": "QTYPE_VMCQ4",
            "orig": [
                70 + (firstCol ? 0 : (118 * icountPerTenth) + rowOffset[icountPerTenth]),
                rowPos[currRow],
            ],
            "bigGaps": [
                20,
                23
            ],
            "gaps": [
                20,
                23
            ],
            "qNos": [
                [[id]]
            ]
        }
    });

    return blocks;
}

const saveTemplate = async (baseTemplate, savePath) => {
    const templateData = JSON.stringify(baseTemplate, null, 2);
    await fs.writeFile(savePath, templateData);
}

(async () => {
    const path = './inputs/pp/template.json';
    await generateTemplate(60, baseTemplate, path);
})();
