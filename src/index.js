//module.exports = function solveSudoku(matrix) {
function solveSudoku(matrix) {
  // your solution
  //let arr = [].concat(...matrix);
  // console.log("matrix to linear \n", JSON.stringify(arr));
  console.log(matrix);

  let set = [];


  function createSet() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // let i = 6;
        // let j = 2;
        let r = Math.floor(i / 3) * 3;
        let c = Math.floor(j / 3) * 3;//(j % 3) * 3;
        //console.log(`r = ${r}  c = ${c}`);
        set[i] = [];
        set[i][j] = new Set();

        // console.log('Elements by column j');
        for (let ii = 0; ii < 9; ii++) {
          set[i][j].add(matrix[ii][j]); //добавляем в множество все элементы столбца j
          //console.log(matrix[ii][j]);
        }

        // console.log('Elements by row i');
        for (let jj = 0; jj < 9; jj++) {
          set[i][j].add(matrix[i][jj]); //добавляем в множество все элементы строки i
          // console.log(matrix[i][jj]);
        }
        // console.log('Elements by block');
        for (let ii = r; ii < r + 3; ii++) {
          for (let jj = c; jj < c + 3; jj++) {
            set[i][j].add(matrix[ii][jj]); //добавляем в множество все элементы блока
            // console.log(matrix[ii][jj]);
          }
        }
      }
    }
  }

  //
  function isExists(value, row, column) {
    //вычисляем координаты левого верхнего угла блока, куда входит элемент matrix[row][column]
    let r = Math.floor(row / 3) * 3;
    let c = Math.floor(column / 3) * 3;

    //проверяем элементы в строке
    for (let i = 0; i < 9; i++) {
      if (matrix[i][column] == value) return true;
    }

    //проверяем элементы в столбце
    for (let j = 0; j < 9; j++) {
      if (matrix[row][j] == value) return true;
    }

    //проверяем элементы в блоке
    for (let i = r; i < r + 3; i++) {
      for (let j = c; j < c + 3; j++) {
        if (matrix[i][j] == value) return true;
      }
    }
    return false;
  }

  //createSet();

  // for (let k = 0; k < 81; k++) {
  //   let r = Math.floor(k / 9);
  //   let c = (k % 9);
  //   console.log(`k = ${k}  r = ${r}  c = ${c}`);
  // }
  //=============================================================//
  function rec(k) {
    if (k == 81) return true; //если достигли конца матрицы

    //вычисляем координаты элемента в матрице в зависимости от k
    let r = Math.floor(k / 9);
    let c = (k % 9);

    if (matrix[r][c] > 0) {
      rec(k + 1); //если элемент уже задан 
    } else {
      for (i = 1; i <= 9; i++) {
        let q = true;
        if (isExists(i, r, c)) {
          q = false;
        }

        if (q) {
          matrix[r][c] = i;
          rec(k + 1);
        }
      }
     // matrix[r][c] = 0;
    }
  }

  rec(0);
  //console.log(isExists(9,0,3));

  console.log("Matrix after\n", matrix);
}

const initial = [
  [0, 0, 0, 9, 7, 0, 0, 0, 2],
  [9, 0, 5, 0, 0, 0, 0, 6, 0],
  [0, 3, 0, 0, 0, 1, 9, 5, 0],
  [0, 9, 0, 0, 0, 4, 2, 0, 3],
  [6, 0, 4, 2, 0, 0, 0, 9, 0],
  [3, 2, 1, 7, 0, 8, 6, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 2, 6],
  [2, 6, 0, 0, 0, 0, 1, 0, 4],
  [0, 0, 0, 0, 2, 6, 5, 0, 0]
];
const copy = initial.map(r => [...r]);
//isSolved(initial, solveSudoku(copy)); true
solveSudoku(copy);


function isSolved(initial, sudoku) {
  for (let i = 0; i < 9; i++) {
    let [r, c] = [Math.floor(i / 3) * 3, (i % 3) * 3];
    //console.log(`r = ${r}  c = ${c}`);
    if (
      (sudoku[i].reduce((s, v) => s.add(v), new Set()).size != 9) ||
      (sudoku.reduce((s, v) => s.add(v[i]), new Set()).size != 9) ||
      (sudoku.slice(r, r + 3).reduce((s, v) => v.slice(c, c + 3).reduce((s, v) => s.add(v), s), new Set()).size != 9)
    ) return false;
  }
  return initial.every((row, rowIndex) => {
    return row.every((num, colIndex) => {
      let cell = sudoku[rowIndex][colIndex]
      return Number.isInteger(cell) && (num === 0 || cell === num);
    });
  });
}