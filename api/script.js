document.getElementById('compile-btn').addEventListener('click', function() {
    const code = document.getElementById('code-editor').value;
    const langId = document.getElementById('language-select').value;

    // User Story 2: Send POST request to compile the code
    fetch('https://codequotient.com/api/executeCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, langId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('output').textContent = data.error;
        } else {
            // User Story 4: Get codeId for fetching the result later
            const codeId = data.codeId;
            document.getElementById('output').textContent = 'Code submitted successfully. Fetching result...';
            fetchResult(codeId);
        }
    })
    .catch(err => {
        document.getElementById('output').textContent = 'Error: ' + err.message;
    });
});

// User Story 5: Fetch the result using codeId
function fetchResult(codeId) {
    const intervalId = setInterval(() => {
        fetch(`https://codequotient.com/api/codeResult/${codeId}`)
        .then(response => response.json())
        .then(data => {
            if (data.data && Object.keys(data.data).length !== 0) {
                clearInterval(intervalId); // User Story 6: Clear interval once result is ready
                displayOutput(data.data);
            }
        })
        .catch(err => {
            clearInterval(intervalId);
            document.getElementById('output').textContent = 'Error fetching result: ' + err.message;
        });
    }, 2000); // Poll every 2 seconds
}

// User Story 6: Display output in the console
function displayOutput(result) {
    if (result.output) {
        document.getElementById('output').textContent = result.output;
    } else if (result.errors) {
        document.getElementById('output').textContent = result.errors;
    }
}
