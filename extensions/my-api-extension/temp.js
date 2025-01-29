const tabIndex = 0;
const dataLayoutPath = `/c1/ts0/tb${tabIndex}`;
const elements = document.querySelectorAll(
    `[data-layout-path='${dataLayoutPath}']`
);

for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', () => {
        console.log(
            'Element with data-layout-path',
            dataLayoutPath,
            'clicked!'
        );
    });
}

const nb = document.createElement('button');
nb.textContent = 'TextButton';
nb.onclick = () => console.log('NewTestButton Clicked');
