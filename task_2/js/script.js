 function reverseTextInTable() {
            const table = document.getElementById('myTable');
            const rows = table.getElementsByTagName('tr');

            for (let row of rows) {
                const cells = row.getElementsByTagName('th');
                for (let cell of cells) {
                    if (cell.textContent.trim()) { // Проверяем, что ячейка не пустая
                        cell.textContent = cell.textContent.split('').reverse().join('');
                    }
                }
            }
        }