document.getElementById('dot-close-macro').addEventListener('click', () => {
    window.electronAPI.closeSelectedMacro();
});

window.electronAPI.onData((data) => {
    (data)
    document.getElementById('title').innerText = data.title;
    document.getElementById('message').innerText = data.message;
    document.getElementById('date').innerText = data.createdAt;
  });

