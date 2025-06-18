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

const navLinks = document.querySelectorAll(".sidebar-nav-main a");
const panels = document.querySelectorAll(".panel");

navLinks.forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();

		const targetId = link.textContent.trim().replace(/\s+/g, "");
		const targetPanel = document.getElementById(targetId);

		// Deactivate all panels
		panels.forEach((panel) => panel.classList.remove("active"));

		// Activate matching panel
		if (targetPanel) {
			targetPanel.classList.add("active");
		}

		// Close sidebar
		sidebar.classList.remove("open-sidebar");
	});
});

// Top Nav Menu (Visible & Invisible)

const headers = document.querySelectorAll(".header");
const topNavs = document.querySelectorAll(".top-nav");

// Check that both NodeLists are the same length
if (headers.length === topNavs.length) {
	headers.forEach((header, index) => {
		const nav = topNavs[index];

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					nav.classList.add("invisible");
				} else {
					nav.classList.remove("invisible");
				}
			},
			{
				root: null,
				threshold: 0,
			}
		);

		observer.observe(header);
	});
} else {
	console.warn("Mismatched number of .header and .top-nav elements.");
}

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

document.querySelectorAll(".grid-card-image").forEach((el, i) => {
	const [startVar, endVar] = gradients[i % gradients.length];
	el.style.background = `linear-gradient(180deg, var(${startVar}), var(${endVar}))`;
});

const gradientsblocks = [
	["--gradient-block-1a", "--gradient-block-1b"],
	["--gradient-block-2a", "--gradient-block-2b"],
	["--gradient-block-4a", "--gradient-block-4b"],
	["--gradient-block-5a", "--gradient-block-5b"],
];

document.querySelectorAll(".block-card-image").forEach((el, i) => {
	const [startVar, endVar] = gradientsblocks[i % gradientsblocks.length];
	el.style.background = `linear-gradient(180deg, var(${startVar}), var(${endVar}))`;
});

// Popover

const menu = document.getElementById("popoverMenu");

document.addEventListener("click", (e) => {
	if (e.target.classList.contains("fa-ellipsis")) {
		e.stopPropagation();

		const icon = e.target;
		const scrollContainer = icon.closest(".container-full"); // 🎯 only lock the nearest scrollable parent

		const rect = icon.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		const menuWidth = 160;
		const menuHeight = 120;
		const padding = 10;

		const offsetX = 24;
		const offsetY = 72;

		let left = rect.right + window.scrollX - menuWidth - offsetX;
		const isBottom = rect.top + rect.height / 2 > vh * 0.5;
		let top;

		if (isBottom) {
			top = rect.top + window.scrollY - menuHeight - offsetY;
		} else {
			top = rect.bottom + window.scrollY + 8;
		}

		left = Math.max(
			padding,
			Math.min(left, vw - menuWidth - padding + window.scrollX)
		);
		top = Math.max(
			padding,
			Math.min(top, document.body.scrollHeight - menuHeight - padding)
		);

		menu.style.left = `${left}px`;
		menu.style.top = `${top}px`;

		menu.classList.remove("hidden");
		void menu.offsetWidth;
		menu.classList.add("show");

		// Lock scrolling only on the closest container
		if (scrollContainer) {
			scrollContainer.classList.add("no-scroll");
			// Save the locked container for later removal
			menu.dataset.lockedContainer = scrollContainer.dataset.containerId =
				Math.random();
		}
	} else {
		menu.classList.remove("show");

		// Find previously locked container and unlock it
		const lockedId = menu.dataset.lockedContainer;
		if (lockedId) {
			const previouslyLocked = document.querySelector(
				`[data-container-id="${lockedId}"]`
			);
			if (previouslyLocked) {
				previouslyLocked.classList.remove("no-scroll");
				previouslyLocked.removeAttribute("data-container-id");
			}
			delete menu.dataset.lockedContainer;
		}

		setTimeout(() => {
			menu.classList.add("hidden");
		}, 200);
	}
});
