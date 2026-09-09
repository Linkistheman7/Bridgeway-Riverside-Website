const engagementTrack = document.getElementById("engagement-track");

if (engagementTrack) {
    const originalItems = [...engagementTrack.querySelectorAll(".engagement-item")];
    const previousButton = document.querySelector(".engagement-control.previous");
    const nextButton = document.querySelector(".engagement-control.next");
    let activeIndex = originalItems.length + 1;
    let isMoving = false;

    originalItems.forEach((item) => engagementTrack.appendChild(item.cloneNode(true)));
    originalItems.forEach((item) => engagementTrack.insertBefore(item.cloneNode(true), engagementTrack.firstChild));

    const items = [...engagementTrack.querySelectorAll(".engagement-item")];
    const originalCount = originalItems.length;

    function centerItem(index, animate = true) {
        const viewport = engagementTrack.parentElement;
        const itemWidth = items[index].offsetWidth;
        const gap = parseFloat(getComputedStyle(engagementTrack).gap) || 0;
        const paddingLeft = parseFloat(getComputedStyle(engagementTrack).paddingLeft) || 0;
        const offset = viewport.clientWidth / 2 - (paddingLeft + index * (itemWidth + gap) + itemWidth / 2);
        engagementTrack.style.transition = animate ? "transform 450ms ease" : "none";
        engagementTrack.style.transform = `translateX(${offset}px)`;
        items.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
    }

    function setExpanded(item, expanded) {
        item.classList.toggle("is-expanded", expanded);
    }

    function showItem(nextIndex) {
        if (isMoving) return;
        isMoving = true;
        activeIndex = nextIndex;
        centerItem(activeIndex);

        window.setTimeout(() => {
            if (activeIndex >= originalCount * 2) {
                activeIndex -= originalCount;
                centerItem(activeIndex, false);
            } else if (activeIndex < originalCount) {
                activeIndex += originalCount;
                centerItem(activeIndex, false);
            }
            isMoving = false;
        }, 460);
    }

    items.forEach((item) => {
        item.tabIndex = 0;
        item.addEventListener("focusin", () => {
            items.forEach((otherItem) => {
                if (otherItem !== item) setExpanded(otherItem, false);
            });
            setExpanded(item, true);
        });
    });

    previousButton.addEventListener("click", () => showItem(activeIndex - 1));
    nextButton.addEventListener("click", () => showItem(activeIndex + 1));
    engagementTrack.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") showItem(activeIndex - 1);
        if (event.key === "ArrowRight") showItem(activeIndex + 1);
    });

    window.addEventListener("load", () => centerItem(activeIndex, false));
    window.addEventListener("resize", () => centerItem(activeIndex, false));
}