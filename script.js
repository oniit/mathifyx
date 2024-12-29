// 24 & 24+ SOLVER

function solve24() {
    const nums = [
        parseFloat(document.getElementById('num1').value),
        parseFloat(document.getElementById('num2').value),
        parseFloat(document.getElementById('num3').value),
        parseFloat(document.getElementById('num4').value)
    ];

    if (nums.some(isNaN)) {
        document.getElementById('result').textContent = 'Please enter valid numbers.';
        return;
    }

    const solutions = findSolutions(nums, 24);
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results

    if (solutions.length > 0) {
        solutions.forEach(solution => {
            const solutionElement = document.createElement('p');  // Use <p> for new line
            solutionElement.textContent = solution;
            resultContainer.appendChild(solutionElement);
        });
    } else {
        resultContainer.textContent = 'No solutions found.';
    }
}

function solveTarget() {
    const nums = [
        parseFloat(document.getElementById('num1').value),
        parseFloat(document.getElementById('num2').value),
        parseFloat(document.getElementById('num3').value),
        parseFloat(document.getElementById('num4').value)
    ];
    const target = parseFloat(document.getElementById('target').value);

    if (nums.some(isNaN) || isNaN(target)) {
        document.getElementById('result').textContent = 'Please enter valid numbers.';
        return;
    }

    const solutions = findSolutions(nums, target);
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results

    if (solutions.length > 0) {
        solutions.forEach(solution => {
            const solutionElement = document.createElement('p');  // Use <p> for new line
            solutionElement.textContent = solution;
            resultContainer.appendChild(solutionElement);
        });
    } else {
        resultContainer.textContent = 'No solutions found.';
    }
}

function findSolutions(numbers, target) {
    const ops = ['+', '-', '*', '/'];
    const results = [];

    function permute(arr, m = []) {
        if (arr.length === 0) {
            checkCombination(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                const curr = arr.slice();
                const next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    }

    function checkCombination(nums) {
        function evalExpr(a, b, op) {
            if (op === '/' && b === 0) return null;
            return eval(`${a} ${op} ${b}`);
        }

        function dfs(vals, expr) {
            if (vals.length === 1) {
                if (Math.abs(vals[0] - target) < 1e-6) {
                    results.push(expr[0]);
                }
                return;
            }

            for (let i = 0; i < vals.length; i++) {
                for (let j = 0; j < vals.length; j++) {
                    if (i !== j) {
                        const remaining = vals.filter((_, idx) => idx !== i && idx !== j);
                        const a = vals[i], b = vals[j];

                        ops.forEach(op => {
                            const result = evalExpr(a, b, op);
                            if (result !== null) {
                                dfs([result, ...remaining], [
                                    `(${expr[i]} ${op} ${expr[j]})`,
                                    ...expr.filter((_, idx) => idx !== i && idx !== j)
                                ]);
                            }
                        });
                    }
                }
            }
        }

        dfs(nums, nums.map(String));
    }

    permute(numbers);
    return [...new Set(results)];
}
// atas clear

// CLUE SOLVER

// Fungsi untuk memeriksa clue
function checkClue(guess, clue) {
    const [numbers, clueType] = clue;
    if (clueType === "0 benar") {
      return guess.every(num => !numbers.includes(num));
    } else if (clueType === "2 benar") {
      return guess.filter((num, i) => num === numbers[i]).length === 2;
    } else if (clueType === "1 benar") {
      return guess.filter((num, i) => num === numbers[i]).length === 1;
    } else if (clueType === "2 salah") {
      return guess.filter((num, i) => numbers.includes(num) && num !== numbers[i]).length === 2;
    } else if (clueType === "1 salah") {
      return guess.filter((num, i) => numbers.includes(num) && num !== numbers[i]).length === 1;
    }
    return false;
  }
  
  // Fungsi untuk memproses form dan mencari solusi
  function solveGame() {
    // Ambil input dari form
    const clues = [];
    
    for (let i = 1; i <= 5; i++) {
      const clueNumbers = [
        parseInt(document.getElementById(`clue${i}-1`).value, 10),
        parseInt(document.getElementById(`clue${i}-2`).value, 10),
        parseInt(document.getElementById(`clue${i}-3`).value, 10),
        parseInt(document.getElementById(`clue${i}-4`).value, 10)
      ];
      const clueType = document.querySelector(`#clue${i} label`).textContent.split(" ")[1];
      clues.push([clueNumbers, clueType]);
    }
  
    // Fungsi untuk menghasilkan semua permutasi
    const permutations = (arr, size) => {
      if (size === 1) return arr.map(el => [el]);
      const result = [];
      arr.forEach((el, i) => {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        permutations(rest, size - 1).forEach(perm => result.push([el, ...perm]));
      });
      return result;
    };
  
    // Cari semua permutasi
    const allPermutations = permutations([...Array(10).keys()], 4);
    const solutions = allPermutations.filter(perm =>
      clues.every(clue => checkClue(perm, clue))
    );
  
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = solutions.length
      ? `Solution found: ${solutions[0].join(", ")}`
      : "No solution found.";
  }
  