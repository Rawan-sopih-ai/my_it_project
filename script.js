 
    function goBack() {
    window.history.back();
    }


    
    
    function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  const msg = document.getElementById('register-msg');

  if (password !== confirm) {
    alert("❌ Passwords do not match!");
    return false;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // تأكد إن الإيميل مش متسجل قبل كده
  const emailExists = users.some(user => user.email === email);
  if (emailExists) {
    alert("❌ This email is already registered!");
    return false;
  }

  // أضف المستخدم
  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  msg.innerText = "✅ Registered Successfully!";
  msg.classList.add('show');

  setTimeout(() => {
    msg.classList.remove('show');
    msg.innerText = "";
  }, 3000);

  // فضي الفورم
  document.getElementById('name').value = "";
  document.getElementById('email').value = "";
  document.getElementById('password').value = "";
  document.getElementById('confirm').value = "";

  return false; // منع إعادة تحميل الصفحة
}


    function validateLoginForm() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const msg = document.getElementById('login-msg');

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    msg.innerText = `✅ Welcome ${user.name}! You are now logged in.`;
    msg.classList.add('show');

    setTimeout(() => {
      msg.classList.remove('show');
      msg.innerText = "";
    }, 3000);

    // ممكن تعرضي اسم المستخدم مثلاً في الهيدر أو تعمل redirect
  } else {
    alert("❌ Invalid email or password.");
  }

  return false;
}
function logout() {
  localStorage.removeItem("currentUser");
  alert("You have been logged out.");
  // ممكن ترجعي لصفحة login
  showSection('login');
}





    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.style.width = sidebar.style.width === '250px' ? '0' : '250px';
    }
  
    function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
    section.style.display = "none";
  });

  // إخفاء الفورم والترايلر يدويًا دائمًا
  document.getElementById("forum").style.display = "none";
  document.getElementById("trailers").style.display = "none";

  setTimeout(() => {
    const selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = "block";
    
    // لو الفورم أو الترايلرز، نظهرهم يدويًا
    if (sectionId === "forum") {
      selectedSection.style.display = "block";
    }
    if (sectionId === "trailers") {
      selectedSection.style.display = "block";
    }

    setTimeout(() => {
      selectedSection.classList.add('active');
    }, 50);
  }, 100);

  if (window.innerWidth <= 768) {
    toggleSidebar();
  }

  if (sectionId === "watchlist") {
    loadWatchlist();
  }
}


   function loadWatchlist() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const container = document.getElementById("watchlistContainer");

  if (!currentUser) {
    container.innerHTML = "<p>⚠ You must be logged in to see your watchlist.</p>";
    return;
  }

  const allLists = JSON.parse(localStorage.getItem("watchlists")) || {};
  const userList = allLists[currentUser.email] || [];

  container.innerHTML = "";
  if (userList.length === 0) {
    container.innerHTML = "<p>📭 Your watchlist is empty.</p>";
    return;
  }

  userList.forEach((movie, index) => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <img src="${movie.img}" alt="${movie.title}" />
      <p>${movie.title}</p>
      <button onclick="removeFromWatchlist(${index})">Remove</button>
    `;
    container.appendChild(div);
  });
}
function removeFromWatchlist(index) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const allLists = JSON.parse(localStorage.getItem("watchlists")) || {};
  const userList = allLists[currentUser.email] || [];

  userList.splice(index, 1);
  allLists[currentUser.email] = userList;
  localStorage.setItem("watchlists", JSON.stringify(allLists));
  loadWatchlist();
}


function postTopic(event) {
    event.preventDefault();

    const title = document.getElementById("topic-title").value.trim();
    const body = document.getElementById("topic-body").value.trim();

    if (!title || !body) return;

    const postContainer = document.getElementById("posts-container");

    const post = document.createElement("div");
    post.classList.add("post");

    post.innerHTML = `
      <h3>${title}</h3>
      <p>${body}</p>
    `;

    postContainer.prepend(post); // يظهر في الأعلى

    // Reset form
    document.getElementById("topic-title").value = "";
    document.getElementById("topic-body").value = "";
  }
window.onload = function() {
  const currentPage = window.location.pathname;

  if (!currentPage.includes('forum.html')) {
    document.getElementById('forum').style.display = 'none'; // إخفاء قسم الفورم
  }

  if (!currentPage.includes('trailers.html')) {
    document.getElementById('trailers').style.display = 'none'; // إخفاء قسم الترايلر
  }
};

window.onload = function () {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    document.getElementById("user-greeting").innerText = `👋 Welcome, ${user.name}`;
  }
}



function showGenre(type) {
  const container = document.getElementById("genreMoviesContainer");
  container.innerHTML = "";

  if (!genreMovies[type] || genreMovies[type].length === 0) {
    container.innerHTML = "<p>No movies available for this genre.</p>";
    return;
  }

  genreMovies[type].forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <a href="movie-details.html?movie=${encodeURIComponent(movie.key)}">
        <img src="${movie.img}" alt="${movie.title}" />
        <p>${movie.title}</p>
      </a>
    `;
    container.appendChild(div);
  });
}


const genreMovies = {
  Action: [
    { title: "El Dashash", key: "el-dashash", img: "pictures/WhatsApp Image 2025-04-24 at 22.53.05_2dd97a2c.jpg" },
    { title: "Amr & Salma", key: "omar-w-salma", img: "pictures/WhatsApp Image 2025-04-24 at 22.53.05_09f4d348.jpg" },
    { title: "Rampage", key: "rampage", img: "https://www.impawards.com/2018/posters/rampage_ver8.jpg" },
    { title: "M3GAN", key: "megan", img: "https://www.impawards.com/2023/posters/m3gan.jpg" }
  ],
  Drama: [
    { title: "Bahebak", key: "bahebak", img: "pictures/WhatsApp Image 2025-05-07 at 04.15.28_e55f91e0.jpg" },
    { title: "Few Hours", key: "few-hours", img: "pictures/WhatsApp Image 2025-04-24 at 22.53.06_67593b05.jpg" },
    { title: "The Good Nurse", key: "the-good-nurse", img: "https://www.movieinsider.com/images/p/653078.jpg" }
  ],
  Comedy: [
    { title: "Terrorism and Kebab", key: "terrorism-and-kebab", img: "pictures/WhatsApp Image 2025-05-07 at 04.15.28_3cd0be0f.jpg" },
    { title: "A Christmas Carol", key: "a-christmas-carol", img: "https://www.impawards.com/2009/posters/christmas_carol.jpg" }
  ],
  Thriller: [
    { title: "The Nun", key: "the-nun", img: "https://www.impawards.com/2018/posters/nun.jpg" },
    { title: "Inception", key: "inception", img: "https://www.impawards.com/2010/posters/inception.jpg" }
  ],
  Fantasy: [
    { title: "The Hobbit", key: "hobbit", img: "https://www.impawards.com/2012/posters/hobbit_an_unexpected_journey.jpg" },
    { title: "King Kong", key: "king-kong", img: "https://www.impawards.com/2005/posters/king_kong.jpg" }
  ],
  Social: [
    { title: "The Yacoubian Building", key: "yacoubian-building", img: "pictures/WhatsApp Image 2025-05-07 at 04.15.28_de7ae8f8.jpg" }
  ],
  Sports: [
    { title: "El Hareefa", key: "el-hareefa", img: "pictures/WhatsApp Image 2025-04-24 at 22.53.05_0624abf1.jpg" }
  ]
};
  