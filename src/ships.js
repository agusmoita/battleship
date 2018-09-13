const ships = [
    {
        id: 1,
        length: 3,
        direction: 'horizontal',
        cells: [
            {
                row: null,
                col: null,
                hit: false
            },
            {
                row: null,
                col: null,
                hit: false
            },
            {
                row: null,
                col: null,
                hit: false
            }
        ],
        destroyed: false
    },
    {
        id: 2,
        length: 3,
        direction: 'vertical',
        cells: [
            {
                row: null,
                col: null,
                hit: false
            },
            {
                row: null,
                col: null,
                hit: false
            },
            {
                row: null,
                col: null,
                hit: false
            }
        ],
        destroyed: false
    },
    {
        id: 3,
        length: 2,
        direction: 'horizontal',
        cells: [
            {
                row: null,
                col: null,
                hit: false
            },
            {
                row: null,
                col: null,
                hit: false
            }
        ],
        destroyed: false
    }
]

export default ships;