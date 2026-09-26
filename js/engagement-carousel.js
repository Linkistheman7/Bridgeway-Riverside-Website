const engagementTrack = document.getElementById("engagement-track");

if (engagementTrack) {
    const originalItems = [...engagementTrack.querySelectorAll(".engagement-item")];
    const previousButton = document.querySelector(".engagement-control.previous");
    const nextButton = document.querySelector(".engagement-control.next");
    let activeIndex = 0;
    let isMoving = false;

    const items = [...engagementTrack.querySelectorAll(".engagement-item")];
    const originalCount = originalItems.length;

    function updateControls() {
        previousButton.disabled = activeIndex === 0;
        nextButton.disabled = activeIndex === originalCount - 1;
    }

    function centerItem(index, animate = true) {
        const viewport = engagementTrack.parentElement;
        const itemWidth = items[index].offsetWidth;
        const gap = parseFloat(getComputedStyle(engagementTrack).gap) || 0;
        const paddingLeft = parseFloat(getComputedStyle(engagementTrack).paddingLeft) || 0;
        const offset = viewport.clientWidth / 2 - (paddingLeft + index * (itemWidth + gap) + itemWidth / 2);
        engagementTrack.style.transition = animate ? "transform 450ms ease" : "none";
        engagementTrack.style.transform = `translateX(${offset}px)`;
        items.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
        updateControls();
    }

    function showItem(nextIndex) {
        if (isMoving || nextIndex < 0 || nextIndex >= originalCount) return;
        isMoving = true;
        activeIndex = nextIndex;
        centerItem(activeIndex);

        let finished = false;
        const finishTransition = () => {
            if (finished) return;
            finished = true;
            engagementTrack.removeEventListener("transitionend", handleTransitionEnd);
            isMoving = false;
        };

        const handleTransitionEnd = (event) => {
            if (event.propertyName === "transform") finishTransition();
        };
        engagementTrack.addEventListener("transitionend", handleTransitionEnd);
        window.setTimeout(finishTransition, 500);
    }

    items.forEach((item) => {
        item.addEventListener("click", () => {
            const itemIndex = items.indexOf(item);
            if (itemIndex !== activeIndex) {
                showItem(itemIndex);
            }
        });
    });

    previousButton.addEventListener("click", () => showItem(activeIndex - 1));
    nextButton.addEventListener("click", () => showItem(activeIndex + 1));

    window.addEventListener("load", () => centerItem(activeIndex, false));
    window.addEventListener("resize", () => centerItem(activeIndex, false));
}