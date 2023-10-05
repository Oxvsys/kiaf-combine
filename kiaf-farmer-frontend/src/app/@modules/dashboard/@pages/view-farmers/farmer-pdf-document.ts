import { FarmerData } from "./farmer.interface";

function myParseFloat(val: any) {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) { return 0; }
    return parsed;
}

export var getPDFMakeDocument = function (farmerData: FarmerData): any {
    let totalArea = 0;
    let areaUnderCrop = 0;
    totalArea = myParseFloat(farmerData.irrigated_farm_area) + myParseFloat(farmerData.non_irrigated_farm_area);
    if(farmerData.crops.length>0){
        areaUnderCrop = farmerData.crops.map(obj => myParseFloat(obj.area)).reduce((a, b) => a + b);
    }
    let tnc=`
    I hereby confirm that the information provided herein is accurate, correct and complete
    and that the documents submitted along with this application form are genuine
    `;
    return {
        info: {
            title: farmerData.first_name + '_' + farmerData.fathers_name + '_' + farmerData.family_name + '_' + farmerData.created_at,
            author: 'Oxvsys Automation',
        },
        content: [
            {
                columns: [
                    {
                        image:
                            'data:image/png;base64,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',
                        width: 100,
                    },
                    [
                        {
                            text: 'Farmer Enlisting Form',
                            color: '#333333',
                            width: '*',
                            fontSize: 28,
                            bold: true,
                            alignment: 'right',
                            margin: [0, 0, 0, 10],
                        },
                        {
                            stack: [
                                {
                                    columns: [
                                        {
                                            text: 'Form no:',
                                            color: '#aaaaab',
                                            bold: true,
                                            width: '*',
                                            fontSize: 12,
                                            alignment: 'right',
                                        },
                                        {
                                            text: farmerData.form_no,
                                            bold: true,
                                            color: '#333333',
                                            fontSize: 12,
                                            alignment: 'right',
                                            width: 80,
                                        },
                                    ],
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Date:',
                                            color: '#aaaaab',
                                            bold: true,
                                            width: '*',
                                            fontSize: 12,
                                            alignment: 'right',
                                        },
                                        {
                                            text: farmerData.created_at,
                                            bold: true,
                                            color: '#333333',
                                            fontSize: 12,
                                            alignment: 'right',
                                            width: 80,
                                        },
                                    ],
                                },
                                //   {
                                //     columns: [
                                //       {
                                //         text: 'Status',
                                //         color: '#aaaaab',
                                //         bold: true,
                                //         fontSize: 12,
                                //         alignment: 'right',
                                //         width: '*',
                                //       },
                                //       {
                                //         text: 'PAID',
                                //         bold: true,
                                //         fontSize: 14,
                                //         alignment: 'right',
                                //         color: 'green',
                                //         width: 100,
                                //       },
                                //     ],
                                //   },
                            ],
                        },
                    ],
                ],
            },
            {
                columns: [
                    {
                        text: 'Farmer Details',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 14,
                        alignment: 'left',
                        margin: [0, 20, 0, 5],
                    },
                    {
                        text: 'Contact Details',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 14,
                        alignment: 'left',
                        margin: [0, 20, 0, 5],
                    },
                ],
            },
            {
                columns: [
                    {
                        text: `Name : ${farmerData.first_name + ' ' + farmerData.fathers_name + ' ' + farmerData.family_name} \n Age : ${farmerData.age}`,
                        bold: true,
                        color: '#333333',
                        alignment: 'left',
                    },
                    {
                        text: `Mobile no : ${farmerData.mobile_nos}  \n Landline no : ${farmerData.landline ? farmerData.landline : 'N/A'} \n Email ID : ${farmerData.email_id ? farmerData.email_id : 'N/A'}`,
                        bold: true,
                        color: '#333333',
                        alignment: 'left',
                    },
                ],
            },
            {
                columns: [
                    {
                        text: 'Address',
                        color: '#aaaaab',
                        bold: true,
                        margin: [0, 7, 0, 3],
                    },
                    {
                        text: 'Land Details',
                        color: '#aaaaab',
                        bold: true,
                        margin: [0, 7, 0, 3],
                    },
                ],
            },
            {
                columns: [
                    {
                        text: `Survey no : ${farmerData.survey_no} \n ${farmerData.address}, ${farmerData.village}`,
                        style: 'invoiceBillingAddress',
                    },
                    {
                        text: `Irrigated farm area : ${farmerData.irrigated_farm_area ? farmerData.irrigated_farm_area : 'N/A'} 
                               Non irrigated farm area: ${farmerData.non_irrigated_farm_area ? farmerData.non_irrigated_farm_area : 'N/A'} 
                               Non farm land : ${farmerData.non_farm_land ? farmerData.non_farm_land : 'N/A'}
                               Total Area : ${totalArea.toFixed(2)}`,
                        style: 'invoiceBillingAddress',
                    },
                ],
            },

            {
                columns: [
                    {
                        text: 'Co-op. Society Membership of',
                        color: '#aaaaab',
                        bold: true,
                        margin: [0, 7, 0, 3],
                    },
                ],
            },
            {
                columns: [
                    {
                        text: farmerData.co_operative_name ? farmerData.co_operative_name : 'N/A',
                        style: 'invoiceBillingAddress',
                    },
                ],
            },
            '\n\n',
            {
                width: '100%',
                alignment: 'center',
                text: 'Crop Details',
                bold: true,
                margin: [0, 10, 0, 10],
                fontSize: 15,
            },
            {
                layout: {
                    defaultBorder: false,
                    hLineWidth: function (i: any, node: any) {
                        return 1;
                    },
                    vLineWidth: function (i: any, node: any) {
                        return 1;
                    },
                    hLineColor: function (i: number, node: any) {
                        if (i === 1 || i === 0) {
                            return '#bfdde8';
                        }
                        return '#eaeaea';
                    },
                    vLineColor: function (i: any, node: any) {
                        return '#eaeaea';
                    },
                    hLineStyle: function (i: any, node: any) {
                        // if (i === 0 || i === node.table.body.length) {
                        return null;
                        //}
                    },
                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    paddingLeft: function (i: any, node: any) {
                        return 10;
                    },
                    paddingRight: function (i: any, node: any) {
                        return 10;
                    },
                    paddingTop: function (i: any, node: any) {
                        return 2;
                    },
                    paddingBottom: function (i: any, node: any) {
                        return 2;
                    },
                    fillColor: function (rowIndex: any, node: any, columnIndex: any) {
                        return '#fff';
                    },
                },
                table: {
                    headerRows: 1,
                    widths: ['*', 80],
                    body: [
                        [
                            {
                                text: 'Crop Name',
                                fillColor: '#eaf2f5',
                                border: [false, true, false, true],
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                            {
                                text: 'Crop Area',
                                border: [false, true, false, true],
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                        ],
                        ...farmerData.crops.map(obj =>
                            [
                                {
                                    text: obj.crop_name,
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: 'left',
                                },
                                {
                                    text: obj.area,
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ]
                        ),
                        [
                            {
                                text: 'Other',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: (totalArea - areaUnderCrop).toFixed(2),
                                border: [false, false, false, true],
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                        ]
                    ],
                },
            },
            {
                width: '100%',
                alignment: 'center',
                text: 'Live Stock Details',
                bold: true,
                margin: [0, 10, 0, 10],
                fontSize: 15,
            },
            {
                layout: {
                    defaultBorder: false,
                    hLineWidth: function (i: any, node: any) {
                        return 1;
                    },
                    vLineWidth: function (i: any, node: any) {
                        return 1;
                    },
                    hLineColor: function (i: number, node: any) {
                        if (i === 1 || i === 0) {
                            return '#bfdde8';
                        }
                        return '#eaeaea';
                    },
                    vLineColor: function (i: any, node: any) {
                        return '#eaeaea';
                    },
                    hLineStyle: function (i: any, node: any) {
                        // if (i === 0 || i === node.table.body.length) {
                        return null;
                        //}
                    },
                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    paddingLeft: function (i: any, node: any) {
                        return 10;
                    },
                    paddingRight: function (i: any, node: any) {
                        return 10;
                    },
                    paddingTop: function (i: any, node: any) {
                        return 2;
                    },
                    paddingBottom: function (i: any, node: any) {
                        return 2;
                    },
                    fillColor: function (rowIndex: any, node: any, columnIndex: any) {
                        return '#fff';
                    },
                },
                table: {
                    headerRows: 1,
                    widths: ['*', 80],
                    body: [
                        [
                            {
                                text: 'Live Stock Name',
                                fillColor: '#eaf2f5',
                                border: [false, true, false, true],
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                            {
                                text: 'Count',
                                border: [false, true, false, true],
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                        ],
                        ...farmerData.live_stocks.map(obj =>
                            [
                                {
                                    text: obj.live_stock_name,
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: 'left',
                                },
                                {
                                    text: obj.count,
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                        ),
                    ],
                },
            },
            '\n',

            {
                text: 'Terms and Conditions : ',
                style: 'notesTitle',
            },
            {
                text: tnc,
                style: 'notesText',
            },

        ],
        styles: {
            notesTitle: {
                fontSize: 10,
                bold: true,
                margin: [0, 50, 0, 3],
            },
            notesText: {
                fontSize: 10,
            },
        },
        defaultStyle: {
            columnGap: 20,
            font: 'Mukta',
        },
    };
};
