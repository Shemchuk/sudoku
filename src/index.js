module.exports = function solveSudoku(matrix) {
  //source from here: https://habr.com/ru/post/113837/

  Sudoku = function (arr) {
    let solved = [];
    let steps = 0;
    let backtracking_call = 0;

    initSolved(arr);
    solve();

    /**
     * Инициализация рабочего массива
     *
     * Рабочий массив представляет собой матрицу 9х9, каждый элемент которой
     * является списком из трех элементов: число, тип элемента (in - заполнен
     * по услвоию, unknown - решение не найдено, solved - решено) и перечень
     * предполагаемых значений элемента.
     */
    function initSolved(arr) {
      steps = 0;
      let suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i = 0; i < 9; i++) {
        solved[i] = [];
        for (let j = 0; j < 9; j++) {
          if (arr[i][j]) {
            solved[i][j] = [arr[i][j], 'in', []];
          }
          else {
            solved[i][j] = [0, 'unknown', suggest];
          }
        }
      }
    }; // end of method initSolved()


    /**
     * Решение судоку
     *
     * Метод в цикле пытается решить судоку, если на текущем этапе не изменилось
     * ни одного элемента, то решение прекращается.
     */
    function solve() {
      let changed = 0;

      do {
        // сужаем множество значений для всех нерешенных чисел
        changed = updateSuggests();
        steps++;
        if (81 < steps) {
          // Зашита от цикла
          break;
        }
      } while (changed);

      if (!isSolved() && !isFailed()) {
        // используем поиск с возвратом
        backtracking();
      }

    }; // end of method solve()


    /**
     * Обновляем множество предположений
     *
     * Проверяем основные правила -- уникальность в строке, столбце и секции.
     */
    function updateSuggests() {
      let changed = 0;
      let buf = arrayDiff(solved[1][3][2], rowContent(1));
      buf = arrayDiff(buf, colContent(3));
      buf = arrayDiff(buf, sectContent(1, 3));
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if ('unknown' != solved[i][j][1]) {
            // Здесь решение либо найдено, либо задано
            continue;
          }

          // "Одиночка"
          changed += solveSingle(i, j);

          // "Скрытый одиночка"
          changed += solveHiddenSingle(i, j);
        }
      }
      return changed;
    }; // end of methos updateSuggests()


    /**
     * Метод "Одиночка"
     */
    function solveSingle(i, j) {
      solved[i][j][2] = arrayDiff(solved[i][j][2], rowContent(i));
      solved[i][j][2] = arrayDiff(solved[i][j][2], colContent(j));
      solved[i][j][2] = arrayDiff(solved[i][j][2], sectContent(i, j));
      if (1 == solved[i][j][2].length) {
        // Исключили все варианты кроме одного
        markSolved(i, j, solved[i][j][2][0]);
        return 1;
      }
      return 0;
    }; // end of method solveSingle()


    /**
     * Метод "Скрытый одиночка"
     */
    function solveHiddenSingle(i, j) {
      var lessSuggest = lessRowSuggest(i, j);
      let changed = 0;
      if (1 == lessSuggest.length) {
        markSolved(i, j, lessSuggest[0]);
        changed++;
      }
      var lessSuggest = lessColSuggest(i, j);
      if (1 == lessSuggest.length) {
        markSolved(i, j, lessSuggest[0]);
        changed++;
      }
      var lessSuggest = lessSectSuggest(i, j);
      if (1 == lessSuggest.length) {
        markSolved(i, j, lessSuggest[0]);
        changed++;
      }
      return changed;
    }; // end of method solveHiddenSingle()


    /**
     * Отмечаем найденный элемент
     */
    function markSolved(i, j, solve) {
      solved[i][j][0] = solve;
      solved[i][j][1] = 'solved';
    }; // end of method markSolved()


    /**
     * Содержимое строки
     */
    function rowContent(i) {
      let content = [];
      for (let j = 0; j < 9; j++) {
        if ('unknown' != solved[i][j][1]) {
          content[content.length] = solved[i][j][0];
        }
      }
      return content;
    }; // end of method rowContent()


    /**
     * Содержимое столбца
     */
    function colContent(j) {
      let content = [];
      for (let i = 0; i < 9; i++) {
        if ('unknown' != solved[i][j][1]) {
          content[content.length] = solved[i][j][0];
        }
      }
      return content;
    }; // end of method colContent()


    /**
     * Содержимое секции
     */
    function sectContent(i, j) {
      let content = [];
      let offset = sectOffset(i, j);
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          if ('unknown' != solved[offset.i + k][offset.j + l][1]) {
            content[content.length] = solved[offset.i + k][offset.j + l][0];
          }
        }
      }
      return content;
    }; // end of method sectContent()


    /**
     * Минимизированное множество предположений по строке
     */
    function lessRowSuggest(i, j) {
      var lessSuggest = solved[i][j][2];
      for (let k = 0; k < 9; k++) {
        if (k == j || 'unknown' != solved[i][k][1]) {
          continue;
        }
        lessSuggest = arrayDiff(lessSuggest, solved[i][k][2]);
      }
      return lessSuggest;
    }; // end of method lessRowSuggest()


    /**
     * Минимизированное множество предположений по столбцу
     */
    function lessColSuggest(i, j) {
      var lessSuggest = solved[i][j][2];
      for (let k = 0; k < 9; k++) {
        if (k == i || 'unknown' != solved[k][j][1]) {
          continue;
        }
        lessSuggest = arrayDiff(lessSuggest, solved[k][j][2]);
      }
      return lessSuggest;
    }; // end of method lessColSuggest()


    /**
     * Минимизированное множество предположений по секции
     */
    function lessSectSuggest(i, j) {
      var lessSuggest = solved[i][j][2];
      let offset = sectOffset(i, j);
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          if (((offset.i + k) == i && (offset.j + l) == j) || 'unknown' != solved[offset.i + k][offset.j + l][1]) {
            continue;
          }
          lessSuggest = arrayDiff(lessSuggest, solved[offset.i + k][offset.j + l][2]);
        }
      }
      return lessSuggest;
    }; // end of method lessSectSuggest()


    /**
     * Вычисление разницы между двумя массивами
     */
    function arrayDiff(arr1, arr2) {
      let arr_diff = [];
      for (let i = 0; i < arr1.length; i++) {
        let is_found = false;
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i] == arr2[j]) {
            is_found = true;
            break;
          }
        }
        if (!is_found) {
          arr_diff[arr_diff.length] = arr1[i];
        }
      }
      return arr_diff;
    }; // end of method arrayDiff()

    /**
     * Расчет смещения секции
     */
    function sectOffset(i, j) {
      return {
        j: Math.floor(j / 3) * 3,
        i: Math.floor(i / 3) * 3
      };
    }; // end of method sectOffset()


    /**
     * Вывод найденного решения
     */
    this.output = function () {
      
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          matrix[i][j] = solved[i][j][0];
        }
      }
      return matrix;
    }; // end of method ()


    /**
     * Проверка на найденное решение
     */
    function isSolved() {
      let is_solved = true;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if ('unknown' == solved[i][j][1]) {
            is_solved = false;
          }
        }
      }
      return is_solved;
    }; // end of method isSolved()


    /**
     * Публичный метод isSolved
     */
    this.isSolved = function () {
      return isSolved();
    }; // end of public method isSolved()


    /**
     * Есть ли ошибка в поиске решения
     *
     * Возвращает true, если хотя бы у одной из ненайденных ячеек
     * отсутствуют кандидаты
     */
    function isFailed() {
      let is_failed = false;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if ('unknown' == solved[i][j][1] && !solved[i][j][2].length) {
            is_failed = true;
          }
        }
      }
      return is_failed;
    }; // end of method isFailed()


    /**
     * Публичный метод isFailed
     */
    this.isFailed = function () {
      return isFailed();
    }; // end of public method isFailed()


    /**
     * Мпетод поиска с возвратом
     */
    function backtracking() {
      backtracking_call++;
      // Формируем новый массив
      let arr = [[], [], [], [], [], [], [], [], []];
      let i_min = -1, j_min = -1, suggests_cnt = 0;
      for (let i = 0; i < 9; i++) {
        arr[i].length = 9;
        for (let j = 0; j < 9; j++) {
          arr[i][j] = solved[i][j][0];
          if ('unknown' == solved[i][j][1] && (solved[i][j][2].length < suggests_cnt || !suggests_cnt)) {
            suggests_cnt = solved[i][j][2].length;
            i_min = i;
            j_min = j;
          }
        }
      }

      // проходим по всем элементам, находим нерешенные,
      // выбираем кандидата и пытаемся решить
      for (let k = 0; k < suggests_cnt; k++) {
        arr[i_min][j_min] = solved[i_min][j_min][2][k];
        // инициируем новый цикл
        let sudoku = new Sudoku(arr);
        if (sudoku.isSolved()) {
          // нашли решение
          out_val = sudoku.solved();
          // Записываем найденное решение
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              if ('unknown' == solved[i][j][1]) {
                markSolved(i, j, out_val[i][j][0])
              }
            }
          }
          return;
        }
      }
    }; // end of function backtracking)(


    /**
     * Возвращает найденное решение
     */
    this.solved = function () {
      return solved;
    }; // end of solved()
  }; // end of class sudoku()

  //создаём объект и выводим результат
  let sudoku = new Sudoku(matrix);
  return sudoku.output();
}
