(() => {
  const selector = (selector) => document.querySelector(selector);
  const create = (element) => document.createElement(element);
  let loading = false;

  const page = selector("body");
  const app = selector("#app");
  const apiURL = "http://www.mocky.io/v2/5dba690e3000008c00028eb6";
  const Login = create("div");
  const Logo = create("img");
  const Form = create("form");
  const email = create("input");
  const password = create("input");
  const button = create("button");
  const Loader = create("span");

  Login.classList.add("login");

  Logo.src = "./assets/images/logo.svg";
  Logo.classList.add("logo");

  email.type = "email";
  email.setAttribute("required", "required");
  email.setAttribute('placeholder', "Entre com seu e-mail")

  password.type = "password";
  password.setAttribute('placeholder', "Digite sua senha supersecreta")

  button.innerHTML = "Entrar";
  button.setAttribute("disabled", "disabled");

  Loader.classList.add("loader");
  Loader.innerHTML = "Carregando...";

  Form.appendChild(email);
  Form.appendChild(password);
  Form.appendChild(button);

  app.appendChild(Logo);
  Login.appendChild(Form);

  Form.onsubmit = async (e) => {
    e.preventDefault();
    const [email, password] = [e.srcElement[0], e.srcElement[1]];

    const { url } = await fakeAuthenticate(email.value, password.value);

    location.href = "#users";

    const users = await getDevelopersList(url);
    renderPageUsers(users);
  };

  Form.oninput = (e) => {
    const [email, password, button] = e.target.parentElement.children;
    !email.value || password.value.length <= 5
      ? button.setAttribute("disabled", "disabled")
      : button.removeAttribute("disabled");
  };

  //   Form.appendChild(Loader)

  const showLoader = () => {
    page.appendChild(Loader);
  };

  const removeLoader = () => {
    Loader.classList.add("hidden");
  };

  async function fakeAuthenticate(email, password) {
    showLoader();
    const data = fetch(apiURL)
      .then((response) => response)
      .finally(() => {
        removeLoader();
      });
    const fakeJwtToken = `${btoa(email + password)}.${btoa(data.url)}.${
      new Date().getTime() + 300000
    }`;

    localStorage.setItem("token", fakeJwtToken);

    return data;
  }

  async function getDevelopersList(url) {
    showLoader();
    localStorage.setItem("url", url);
    const users = await fetch(localStorage.getItem("url"))
      .then((response) => response.json())
      .then((data) => data.url)
      .finally(() => {
        removeLoader();
      });

    const userList = await fetch(users)
      .then((response) => response.json())
      .then((data) => data);
    return userList;
  }

  function renderPageUsers(users) {
    app.classList.add("logged");
    Login.style.display = "none";

    const Ul = create("ul");
    for (let i = 0; i < users.length; i++) {
      const Li = create("li");
      const Img = create("img");
      Img.src = users[i].avatar_url;
      Li.appendChild(Img);
      Li.innerHTML += users[i].login;
      Ul.appendChild(Li);
    }
    Ul.classList.add("container");
    app.appendChild(Ul);
  }

  // init
  (async function () {
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.split(".") : null;
    if (!token || token[2] < new Date().getTime()) {
      localStorage.removeItem("token");
      location.href = "#login";
      app.appendChild(Login);
    } else {
      location.href = "#users";
      const users = await getDevelopersList(localStorage.getItem("url"));
      renderPageUsers(users);
    }
  })();
})();
