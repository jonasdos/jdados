function buscaTransferencias() {
  document.addEventListener('DOMContentLoaded', () => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    };

    const url = "https://www.transfermarkt.co.uk/transfers/transferrekorde/statistik/top/plus/0/galerie/0?saison_id=2000";

    fetch(url, { headers })
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const players = [];
        const values = [];

        doc.querySelectorAll('td .hauptlink a').forEach((element, index) => {
          if (index % 2 === 0) { players.push(element.textContent) };
        });


        doc.querySelectorAll('td.rechts.hauptlink').forEach((element) => {
          values.push(element.textContent);
        });

        const data = players.map((player, index) => ({
          player,
          value: values[index]
        }));

        const tbody = document.querySelector('#transfersTable tbody');

        data.forEach(item => {
          const row = document.createElement('tr');
          const playerCell = document.createElement('td');
          const valueCell = document.createElement('td');

          playerCell.textContent = item.player;
          valueCell.textContent = item.value;

          row.appendChild(playerCell);
          row.appendChild(valueCell);

          tbody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error fetching the page:', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/47.0.2526.106 Safari/537.36'
  });

  const url = "https://www.transfermarkt.co.uk/premier-league/startseite/wettbewerb/GB1";

  fetch(url, { headers })
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const teamLinks = [];
      const links = doc.querySelectorAll('tbody .hauptlink a');

      links.forEach(item => {
        let element = item.innerHTML
        let linkelement = item.getAttribute('href')
        if (element.includes('<') || teamLinks.some(item => item.nome === element || linkelement.includes('/spielplan/'))) { } else {
          teamLinks.push("https://www.transfermarkt.co.uk" + item.getAttribute('href'));
        }
      })
      console.log(teamLinks)
      getPlayerLinks(teamLinks)

    })
    .catch(error => {
      console.error('Error fetching the page:', error);
    });
});

function getPlayerLinks(teamLinks) {
  const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/47.0.2526.106 Safari/537.36'
  });

  const playerLinks = [];

  Promise.all(teamLinks.map(item => {
    return fetch(item, { headers })
      .then(response => response.text())
      .then(html => {

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const links = doc.querySelectorAll('tbody .hauptlink a');

        links.forEach(link => {

          const playerUrl = "https://www.transfermarkt.co.uk" + link.getAttribute('href');
          if (!playerLinks.includes(playerUrl)) {
            playerLinks.push(playerUrl);
          }
        })


      });
  }))
    .then(() => {
      getPlayerImages(playerLinks);
    })
    .catch(error => {
      console.error('Error fetching player links:', error);
    });
}


function getPlayerImages(playerLinks) {
  const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/47.0.2526.106 Safari/537.36'
  });


  Promise.all(playerLinks.map(playerUrl => {
    return fetch(playerUrl, { headers })
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const name = doc.querySelector('h1 strong').textContent;
        const image = doc.querySelector(`.data-header__profile-container img`);
        if (image.getAttribute('title') === name) {
          const src = image.getAttribute('src')
          downloadImage(src, name)
        }
      });
  }))
    .catch(error => {
      console.error('Error fetching player images:', error);
    });
}

function downloadImage(src, name) {
  const div = document.querySelector('tbody')
  const container = document.createElement('div')
  container.classList.add('playerCard')
  const img = document.createElement('img')
  const h1 = document.createElement('h1')
  h1.classList.add('playerName')
  img.src = src
  img.alt = name
  h1.innerHTML = name

  container.appendChild(img)
  container.appendChild(h1)
  div.appendChild(container)

}
