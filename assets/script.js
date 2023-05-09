const form = document.getElementById('searchForm');
const searchTerm = document.getElementById('searchTerm');
const results = document.getElementById('results');
form.addEventListener('submit', event => {
	event.preventDefault();
	const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&term=${searchTerm.value}`;
	fetch(url)
		.then(response => response.json())
		.then(data => {
			const ids = data.esearchresult.idlist;
			results.innerHTML = '';
			let contador = 0;
			for (let id of ids) {
				const articleUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&id=${id}`;
				fetch(articleUrl)
					.then(response => response.text())
					.then(data => {
						const parser = new DOMParser();
						const xml = parser.parseFromString(data, 'text/xml');
						const article = xml.querySelector('PubmedArticle');
						const li = document.createElement('li');
						const link = document.createElement('a');
						link.href = `https://www.ncbi.nlm.nih.gov/pubmed/${id}`;
						link.target = '_blank';
						link.textContent = (contador=contador+1) +'- '+article.querySelector('ArticleTitle').textContent;
						li.appendChild(link);
						const authors = article.querySelectorAll('AuthorList > Author > LastName');
						const authorNames = Array.from(authors).map(author => author.textContent).join(', ');
						const authorElement = document.createElement('p');
						authorElement.textContent = `Autores: ${authorNames}`;
						li.appendChild(authorElement);
						const abstract = article.querySelector('AbstractText');
						if (abstract) {
							const abstractElement = document.createElement('p');
							abstractElement.textContent = `Resumo: ${abstract.textContent}`;
							li.appendChild(abstractElement);
						}
						results.appendChild(li);
					})
					.catch(error => console.error(error));
			}
		})
		.catch(error => console.error(error));
});