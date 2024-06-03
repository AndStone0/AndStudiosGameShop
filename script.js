document.addEventListener('DOMContentLoaded', function() {
    const loginRegisterPanel = document.getElementById('loginRegisterPanel');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const backButton = document.getElementById('backButton');
    const ownerControls = document.getElementById('ownerControls');
    const fileUploadForm = document.getElementById('fileUploadForm');
    const filesContainer = document.getElementById('filesContainer');
    const paymentPanel = document.getElementById('paymentPanel');
    const processPaymentButton = document.getElementById('processPaymentButton');
    let selectedFileContent = null;
    let selectedFilePrice = null;
    let selectedFileEmail = null;

    // Ensure no default files are in the filesContainer on load
    filesContainer.innerHTML = '';

    // Load files from localStorage on page load
    loadFilesFromStorage();

    function loadFilesFromStorage() {
        const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
        storedFiles.forEach(file => {
            addFilePanel(file.title, file.price, file.content);
        });
    }

    function saveFilesToStorage() {
        const files = [];
        const filePanels = filesContainer.querySelectorAll('.filePanel');
        filePanels.forEach(panel => {
            const title = panel.querySelector('h3').textContent;
            const price = panel.querySelector('p').textContent.replace('Price: $', '');
            const content = panel.querySelector('textarea').textContent;
            files.push({ title, price, content });
        });
        localStorage.setItem('uploadedFiles', JSON.stringify(files));
    }

    function showLoginRegisterPanel() {
        loginRegisterPanel.classList.remove('hidden');
        dashboard.classList.add('hidden');
    }

    function showDashboard() {
        dashboard.classList.remove('hidden');
        loginRegisterPanel.classList.add('hidden');
    }

    function showBackButton() {
        backButton.classList.remove('hidden');
    }

    function hideBackButton() {
        backButton.classList.add('hidden');
    }

    function showOwnerControls() {
        ownerControls.classList.remove('hidden');
    }

    function hideOwnerControls() {
        ownerControls.classList.add('hidden');
    }

    function showFileUploadForm() {
        fileUploadForm.classList.remove('hidden');
    }

    function hideFileUploadForm() {
        fileUploadForm.classList.add('hidden');
    }

    function showPaymentPanel() {
        paymentPanel.classList.remove('hidden');
    }

    function hidePaymentPanel() {
        paymentPanel.classList.add('hidden');
    }

    function downloadFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    function addFilePanel(title, price, content) {
        const filePanel = document.createElement('div');
        filePanel.classList.add('filePanel');
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.setAttribute('contenteditable', 'true'); // Make title editable
        filePanel.appendChild(titleElement);
        
        const priceElement = document.createElement('p');
        priceElement.textContent = 'Price: $' + price;
        filePanel.appendChild(priceElement);

        const contentTextArea = document.createElement('textarea');
        contentTextArea.textContent = content;
        filePanel.appendChild(contentTextArea);
        
        const emailInput = document.createElement('input');
        emailInput.setAttribute('type', 'email');
        emailInput.setAttribute('placeholder', 'Enter your email');
        filePanel.appendChild(emailInput);
        
        const button = document.createElement('button');
        button.textContent = price === '0' ? 'Get' : 'Buy';
        filePanel.appendChild(button);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        filePanel.appendChild(removeButton);

        removeButton.addEventListener('click', function() {
            filesContainer.removeChild(filePanel);
            saveFilesToStorage();
        });

        if (price === '0') {
            button.addEventListener('click', function() {
                // Download the file
                downloadFile(title + '.txt', content);
            });
        } else {
            button.addEventListener('click', function() {
                // Show payment panel
                selectedFileContent = content;
                selectedFilePrice = price;
                selectedFileEmail = emailInput.value;
                if (selectedFileEmail) {
                    showPaymentPanel();
                } else {
                    alert('Owner must enter a valid email address.');
                }
            });
        }

        // Handle title editing
        titleElement.addEventListener('blur', function() {
            // Save the edited title if needed
            console.log('New title:', titleElement.textContent);
            saveFilesToStorage();
        });

        filesContainer.appendChild(filePanel);
        saveFilesToStorage(); // Save files to localStorage
    }

    // Handle login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const usernameInput = loginForm.querySelector('input[type="text"]').value;
        const passwordInput = loginForm.querySelector('input[type="password"]').value;
        
        // Check if username and password match owner credentials
        if (usernameInput === '1234' && passwordInput === 'GIGEL') {
            showDashboard();
            showBackButton();
            showOwnerControls();
            showFileUploadForm(); // Show file upload form for owner
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });

    // Handle register form submission
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Your registration logic goes here
        // For now, let's just call showDashboard() to simulate successful registration
        showDashboard();
        showBackButton();
        showOwnerControls(); // Show owner controls for demonstration
    });

    // Handle back button click
    backButton.addEventListener('click', function() {
        showLoginRegisterPanel();
        hideBackButton();
        hideOwnerControls(); // Hide owner controls when returning to login/register panel
        hideFileUploadForm(); // Hide file upload form when returning to login/register panel
        hidePaymentPanel(); // Hide payment panel when returning to login/register panel
    });

    // Handle file upload form submission
    fileUploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const titleInput = fileUploadForm.querySelector('input[type="file"]').files[0].name;
        const priceInput = fileUploadForm.querySelector('input[type="text"]').value;
        const fileReader = new FileReader();
        
        fileReader.onload = function(e) {
            const content = e.target.result;
            addFilePanel(titleInput, priceInput, content);
        };

        fileReader.readAsText(fileUploadForm.querySelector('input[type="file"]').files[0]);
    });

    // Handle payment processing
    processPaymentButton.addEventListener('click', function() {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        // Validate card details (you would need a more robust validation)
        if (cardNumber && expiryDate && cvv) {
            alert(`Payment of $${selectedFilePrice} successful! Money sent to ${selectedFileEmail}`);
            // Simulate downloading the file after payment
            downloadFile('PurchasedFile.txt', selectedFileContent);
            hidePaymentPanel();
        } else {
            alert('Please fill in all the fields.');
        }
    });

    // Call showLoginRegisterPanel() initially
    showLoginRegisterPanel();
});