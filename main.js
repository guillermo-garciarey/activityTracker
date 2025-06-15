// Toggle Theme (Dark & Light)

const toggleItem = document.getElementById("toggle-theme");
const label = toggleItem.querySelector("small");
const root = document.documentElement;

if (localStorage.getItem("theme") === "dark") {
	root.classList.add("dark");
	label.textContent = "Dark Mode";
} else {
	label.textContent = "Light Mode";
}

toggleItem.addEventListener("click", () => {
	const isDark = root.classList.toggle("dark");
	label.textContent = isDark ? "Dark Mode" : "Light Mode";
	localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Toggle Side Bar

const toggleSidebarBtn = document.getElementById("toggle-sidebar");
const sidebar = document.querySelector(".sidebar");

toggleSidebarBtn.addEventListener("click", () => {
	sidebar.classList.toggle("open-sidebar");
});

// Top Nav Menu (Visible & Invisible)

const header = document.querySelector(".header");
const topNav = document.querySelector(".top-nav");

const observer = new IntersectionObserver(
	([entry]) => {
		if (entry.isIntersecting) {
			topNav.classList.add("invisible");
		} else {
			topNav.classList.remove("invisible");
		}
	},
	{
		root: null, // viewport
		threshold: 0, // when even 1px is visible
	}
);

observer.observe(header);
