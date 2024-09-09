document.addEventListener('DOMContentLoaded', () => {
    const newsListDiv = document.getElementById('news-list');
    const filterInput = document.getElementById('filter');
    const sortAscButton = document.getElementById('sort-asc');
    const sortDescButton = document.getElementById('sort-desc');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const signupForm = document.getElementById('signup-form');
    const signupError = document.getElementById('signup-error');
    
    let currentPage = 1;
    const pageSize = 2;
    let newsData = [];

    function fetchNews() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                newsData = data;
                displayNews();
            })
            .catch(error => console.error('Error fetching news:', error));
    }

    function displayNews() {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const newsToDisplay = newsData.slice(start, end);
    
        newsListDiv.innerHTML = newsToDisplay.map(news => `
            <div class="news-item">
                <img src="${news.urlToImage}" alt="${news.title}">
                <div>
                    <h3>${news.title}</h3>
                    <p><strong>Author:</strong> ${news.author}</p>
                    <p>${news.description}</p>
                    <a href="${news.url}" target="_blank">Read more</a>
                </div>
            </div>
        `).join('');
    }
    
    function handleFilter() {
        const filterText = filterInput.value.toLowerCase();
        const filteredNews = newsData.filter(news => news.title.toLowerCase().includes(filterText));
        newsListDiv.innerHTML = filteredNews.map(news => `
            <div class="news-item">
                <h3>${news.title}</h3>
                <p><strong>Author:</strong> ${news.author}</p>
                <p>${news.description}</p>
                <a href="${news.url}" target="_blank">Read more</a>
            </div>
        `).join('');
    }

    function handleSort(order) {
        newsData.sort((a, b) => {
            if (order === 'asc') {
                return new Date(a.publishedAt) - new Date(b.publishedAt);
            } else {
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            }
        });
        displayNews();
    }

    function handlePagination(direction) {
        if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (direction === 'next' && currentPage * pageSize < newsData.length) {
            currentPage++;
        }
        displayNews();
    }

    function handleSignup(event) {
        event.preventDefault();
        const name = event.target.name.value.trim();
        const email = event.target.email.value.trim();

        if (name && email) {
            signupError.textContent = 'Signup successful!';
            // Add code here to handle the signup process
        } else {
            signupError.textContent = 'Please fill out all fields.';
        }
    }

    filterInput.addEventListener('input', handleFilter);
    sortAscButton.addEventListener('click', () => handleSort('asc'));
    sortDescButton.addEventListener('click', () => handleSort('desc'));
    prevButton.addEventListener('click', () => handlePagination('prev'));
    nextButton.addEventListener('click', () => handlePagination('next'));
    signupForm.addEventListener('submit', handleSignup);

    fetchNews();
});
