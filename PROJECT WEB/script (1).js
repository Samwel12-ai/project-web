// API Configuration
const API_URL = 'https://683a3eca43bb370a867237f8.mockapi.io/patients';

// Example of using fetch directly
// fetch('https://683a3eca43bb370a867237f8.mockapi.io/patients');

// DOM Elements
const searchInput = document.getElementById('searchInput');
const patientModal = document.getElementById('patientModal');
const patientForm = document.getElementById('patientForm');
const addPatientBtn = document.getElementById('addPatientBtn');
const closeButtons = document.querySelectorAll('.close-btn');

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm)
    );
    renderPatients(filteredPatients);
});

// Modal Controls
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').classList.remove('active');
    });
});

addPatientBtn.addEventListener('click', () => {
    editingPatientId = null;
    patientForm.reset();
    patientModal.classList.add('active');
});

let editingPatientId = null;

// Form Submissions
patientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const patientData = {
        name: document.getElementById('patientName').value,
        gender: document.getElementById('patientGender').value,
        birthDate: document.getElementById('patientBirthDate').value,
        phone: document.getElementById('patientPhone').value,
        room: document.getElementById('patientRoom').value,
        icu: document.getElementById('patientICU').checked
    };

    if (editingPatientId) {
        await updatePatient(editingPatientId, patientData);
    } else {
        await addPatient(patientData);
    }
    
    patientModal.classList.remove('active');
});



// CRUD Operations
async function addPatient(patient) {
    try {
        const response = await fetch('https://683a3eca43bb370a867237f8.mockapi.io/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient)
        });

        if (!response.ok) throw new Error('Failed to add patient');

        await loadPatients();
        showAlert('Patient added successfully!', 'success');
    } catch (error) {
        console.error('Error adding patient:', error);
        showAlert('Failed to add patient', 'error');
    }
}

function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (patient) {
        editingPatientId = id;
        document.getElementById('patientName').value = patient.name;
        document.getElementById('patientGender').value = patient.gender;
        document.getElementById('patientBirthDate').value = patient.birthDate;
        document.getElementById('patientPhone').value = patient.phone;
        document.getElementById('patientRoom').value = patient.room || '';
        document.getElementById('patientICU').checked = patient.icu;
        patientModal.classList.add('active');
    }
}

async function updatePatient(id, updatedData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error('Failed to update patient');

        await loadPatients();
        showAlert('Patient updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating patient:', error);
        showAlert('Failed to update patient', 'error');
    }
}

async function deletePatient(id) {
    try {
        if (confirm('Are you sure you want to delete this patient?')) {
            console.log('Attempting to delete patient with ID:', id);
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete patient. Status: ${response.status}`);
            }

            await loadPatients();
            showAlert('Patient deleted successfully!', 'success');
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        showAlert('Failed to delete patient. Please try again.', 'error');
    }
}



// Render Functions
function renderPatients(patientList = patients) {
    const tbody = document.querySelector('#patientsTable tbody');
    tbody.innerHTML = '';

    patientList.forEach(patient => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.gender}</td>
            <td>${patient.birthDate}</td>
            <td>${patient.phone}</td>
            <td>${patient.room || 'N/A'}</td>
            <td>${patient.icu ? 'Yes' : 'No'}</td>
            <td>
                <button onclick="editPatient('${patient.id}')" class="action-btn">Edit</button>
                <button onclick="deletePatient('${patient.id}')" class="action-btn">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}



// Utility Functions


function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert ${type}`;
    alert.style.display = 'block';

    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}



// Load patients from API
async function loadPatients() {
    try {
        const response = await fetch('https://683a3eca43bb370a867237f8.mockapi.io/patients');
        if (!response.ok) throw new Error('Failed to fetch patients');
        
        patients = await response.json();
        renderPatients();
        updateDashboard();
    } catch (error) {
        console.error('Error loading patients:', error);
        showAlert('Failed to load patients', 'error');
    }
}

// Initial Render
async function initializeApp() {
    await loadPatients();
}

initializeApp();