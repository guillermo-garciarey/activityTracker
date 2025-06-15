// Service Worker Setup

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((reg) => console.log("Service Worker registered:", reg.scope))
			.catch((err) =>
				console.error("Service Worker registration failed:", err)
			);
	});
}

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

// 1. Close sidebar on outside click
document.addEventListener("click", (e) => {
	// If sidebar is open and click is outside both sidebar and toggle button
	if (
		sidebar.classList.contains("open-sidebar") &&
		!sidebar.contains(e.target) &&
		!toggleSidebarBtn.contains(e.target)
	) {
		sidebar.classList.remove("open-sidebar");
	}
});

// 2. Swipe gesture to close (right-to-left swipe)
let touchStartX = 0;
let touchEndX = 0;

sidebar.addEventListener("touchstart", (e) => {
	touchStartX = e.changedTouches[0].screenX;
});

sidebar.addEventListener("touchend", (e) => {
	touchEndX = e.changedTouches[0].screenX;
	handleSwipe();
});

function handleSwipe() {
	const swipeDistance = touchStartX - touchEndX;
	if (swipeDistance < -50) {
		sidebar.classList.remove("open-sidebar");
	}
}

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

// Activity Card Gradient Generator

const gradients = [
	["--gradient-1a", "--gradient-1b"],
	["--gradient-2a", "--gradient-2b"],
	["--gradient-3a", "--gradient-3b"],
	["--gradient-4a", "--gradient-4b"],
	["--gradient-5a", "--gradient-5b"],
];

document.querySelectorAll(".alt-card-image").forEach((el, i) => {
	const [startVar, endVar] = gradients[i % gradients.length];
	el.style.background = `linear-gradient(180deg, var(${startVar}), var(${endVar}))`;
});
