const domain = 'b24-3mnaqi.bitrix24.vn';
const proxyUrl = 'https://api.allorigins.win/get?url=';
const apiUrl = encodeURIComponent('https://bx-oauth2.aasc.com.vn/bx/oauth2_token/local.66b1f6cd2fc578.18221948');

async function fetchAccessToken() {
    try {
        const response = await fetch(proxyUrl + apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return JSON.parse(data.contents).token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        alert('Failed to fetch access token. Check the console for details.');
    }
}

async function fetchEmployees() {
    const token = await fetchAccessToken();
    if (!token) return; // Exit if token retrieval fails

    try {
        const response = await fetch(`https://${domain}/rest/user.get.json?auth=${token}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error fetching employees:', error);
        alert('Failed to fetch employee data. Check the console for details.');
    }
}

function renderEmployeeList(employees) {
    const list = document.getElementById('employee-list');
    list.innerHTML = '';
    employees.forEach(emp => {
        const li = document.createElement('li');
        li.textContent = `${emp.NAME} ${emp.LAST_NAME}`;
        li.onclick = () => selectEmployee(li, emp);
        list.appendChild(li);
    });
}

function selectEmployee(element, employee) {
    document.querySelectorAll('#employee-list li').forEach(li => li.classList.remove('highlight'));
    element.classList.add('highlight');
    document.getElementById('view').disabled = false;
    window.selectedEmployee = employee;
}

function viewEmployeeDetails() {
    if (window.selectedEmployee) {
        document.getElementById('employee-details').innerHTML = `
            <h2>${window.selectedEmployee.NAME} ${window.selectedEmployee.LAST_NAME}</h2>
            <p>Email: ${window.selectedEmployee.EMAIL}</p>
            <p>Last Login: ${window.selectedEmployee.LAST_LOGIN}</p>
            <p>Registered: ${window.selectedEmployee.DATE_REGISTER}</p>
        `;
        document.getElementById('dialog').classList.remove('hidden');
    }
}

document.getElementById('refresh').addEventListener('click', async () => {
    const employees = await fetchEmployees();
    if (employees) {
        renderEmployeeList(employees);
    }
});

document.getElementById('view').addEventListener('click', viewEmployeeDetails);

document.getElementById('close-dialog').addEventListener('click', () => {
    document.getElementById('dialog').classList.add('hidden');
});

// Initial load
(async () => {
    const employees = await fetchEmployees();
    if (employees) {
        renderEmployeeList(employees);
    }
})();
