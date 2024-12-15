const searchInput = document.getElementById('search');
const autocompleteList = document.getElementById('autocomplete-list');
const repoList = document.getElementById('repo-list');

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

async function fetchRepositories(query) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
    const data = await response.json();
    return data.items;
}

function renderAutocomplete(repos) {
    autocompleteList.innerHTML = '';
    repos.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = repo.name;
        li.addEventListener('click', () => {
            addRepositoryToList(repo);
            searchInput.value = '';
            autocompleteList.innerHTML = '';
        });
        autocompleteList.appendChild(li);
    });
}

function addRepositoryToList(repo) {
    const div = document.createElement('div');
    div.className = 'repo-item';
    div.innerHTML = `
    <span><strong>${repo.name}</strong> by ${repo.owner.login} - ⭐ ${repo.stargazers_count}</span>
    <button>Remove</button>
  `;
    div.querySelector('button').addEventListener('click', () => div.remove());
    repoList.appendChild(div);
}

const handleInputChange = debounce(async () => {
    const query = searchInput.value.trim();
    if (!query) {
        autocompleteList.innerHTML = '';
        return;
    }
    const repos = await fetchRepositories(query);
    renderAutocomplete(repos);
}, 500);

searchInput.addEventListener('input', handleInputChange);