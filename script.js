document.addEventListener("DOMContentLoaded", function () {
  // Expandable Info Toggle
  const learnMoreBtn = document.getElementById("learn-more-btn");
  const expandablediv = document.getElementById("expandable-info");

  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", function () {
      expandablediv.classList.toggle("expanded");
      learnMoreBtn.textContent = expandablediv.classList.contains("expanded")
        ? "- Our Programs"
        : "+ Our Programs";

      if (expandablediv.classList.contains("expanded")) {
        setTimeout(() => {
          expandablediv.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    });
  }

  // Timeline Click Handler
  document.querySelectorAll(".year-item").forEach((yearItem) => {
    yearItem.addEventListener("click", function () {
      const selectedYear = this.dataset.year;
      document
        .querySelectorAll(".year-item")
        .forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      document
        .querySelectorAll(".timeline-image")
        .forEach((i) => i.classList.remove("active"));
      const image = document.querySelector(
        `.timeline-image[data-year="${selectedYear}"]`
      );
      if (image) image.classList.add("active");
    });
  });

  // DOM update for checkboxes
  const items = document.querySelectorAll("#cid_1 label span");
  items.forEach(function (el) {
    if (el.innerHTML.includes("-")) {
      el.innerHTML.split("-");
      el.innerHTML =
        "<div>" + el.innerHTML.replace("-", "</div><div>") + "</div>";
    }
    var spanText = el.innerText.toLowerCase();
    if (spanText.includes("reserved") || spanText.includes("dedicated")) {
      el.closest(".form-checkbox-item").classList.add("reserved-dedication");
    }
  });

  // Scrape dedications from another page
  async function scrapeEvents() {
    try {
      const res = await fetch("/6968386");
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      /** ------------ Dedications Table ------------ **/
      const table = doc.getElementById("dedications");
      const container = document.getElementById("dedication-list");
      const rows = table?.querySelectorAll("tr") || [];
      const categories = {};

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        if (cells.length < 5) continue;

        const name = cells[0].textContent.trim();
        const price = cells[1].textContent.trim();
        const checkbox = cells[2].textContent.trim().toLowerCase();
        const reserved = checkbox === "yes" || false;
        const category = cells[3].textContent.trim();
        const options = cells[4].textContent.trim();
        if (!name || !category) continue;

        const item = { name, price, reserved, options };
        if (!categories[category]) categories[category] = [];
        categories[category].push(item);
      }

      for (const [category, items] of Object.entries(categories)) {
        const section = document.createElement("div");
        section.className = "dedication-category";

        const heading = document.createElement("h4");
        heading.textContent = category;
        section.appendChild(heading);

        const categoryContainer = document.createElement("div");
        categoryContainer.className = "dedications-container";
        section.appendChild(categoryContainer);

        items.forEach((item) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "dedication-item";

          const nameText = document.createElement("div");
          nameText.className = "title";
          nameText.textContent = `${item.name}`;
          itemDiv.appendChild(nameText);

          const priceAndBtn = document.createElement("div");
          priceAndBtn.className = "price-btn-container";

          const priceEl = document.createElement("div");
          priceEl.className = "price";
          priceEl.textContent = `$${item.price}`;

          priceAndBtn.appendChild(priceEl);

          let actionEl;
          if (item.reserved) {
            actionEl = document.createElement("span");
            actionEl.textContent = "Reserved";
            actionEl.className = "dedicate-disabled";
          } else {
            actionEl = document.createElement("a");
            actionEl.href = `/templates/articlecco_cdo/aid/6970745/jewish/Donations.htm?${new URLSearchParams(
              { options: item.options }
            )}`;
            actionEl.textContent = "Dedicate";
            actionEl.className = "dedicate-link";
          }

          priceAndBtn.appendChild(actionEl);
          itemDiv.appendChild(priceAndBtn);
          categoryContainer.appendChild(itemDiv);
        });

        container.appendChild(section);
      }

      /** ------------ Progress Table ------------ **/
      const progressTable = doc.getElementById("progress-table");
      if (progressTable) {
        const progressRows = progressTable.querySelectorAll("tr");

        let goal = 0;
        let raised = 0;

        for (let row of progressRows) {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 2) {
            const label = cells[0].textContent.trim().toLowerCase();
            const value = parseFloat(
              cells[1].textContent.replace(/[^0-9.]/g, "")
            );
            if (label.includes("goal")) goal = value;
            if (label.includes("raised")) raised = value;
          }
        }

        if (goal && raised) {
          const percent = Math.min((raised / goal) * 100, 100);

          // Update DOM
          const bar = document.querySelector(".progress-bar");
          const label = document.querySelector(".campaign-progress h4");

          if (bar) {
            bar.style.width = `${percent}%`;
            bar.setAttribute("aria-valuenow", percent.toFixed(0));
          }

          if (label) {
            label.textContent = `$${raised.toLocaleString()} OF $${goal.toLocaleString()} RAISED`;
          }
        }
      }
    } catch (err) {
      console.error("Error loading dedications:", err);
    }
  }

  scrapeEvents();

  // Handle checkbox changes
  function handleCheckboxChange(event) {
    const checkbox = event.target;
    const name = checkbox.value.split("-")[0].trim();
    const price = checkbox.value.split("-")[1].trim();
    const tableBody = document.getElementById("donation-table-body");
    const rowId = `row-${name.replace(/\s+/g, "-")}`;

    if (checkbox.checked) {
      const row = document.createElement("tr");
      row.id = rowId;
      row.innerHTML = `
          <td>
            <button class="remove-btn" title="Remove donation" aria-label="Remove ${name}">&#x2715;</button>
          </td>
          <td>${name}</td>
          <td class="price" data-price="${price}">$${price.toLocaleString()}</td>
        `;
      tableBody.appendChild(row);

      row.querySelector(".remove-btn").addEventListener("click", () => {
        row.remove();
        checkbox.checked = false;
        updateTotal();
      });
    } else {
      const existingRow = document.getElementById(rowId);
      if (existingRow) existingRow.remove();
    }

    updateTotal();
  }

  function getPriceFromCheckbox(checkbox) {
    const itemDiv = checkbox.closest(".item");
    const priceSpan = itemDiv?.querySelector(".price");
    return priceSpan
      ? parseFloat(priceSpan.textContent.replace(/[^0-9.]/g, ""))
      : null;
  }

  function updateTotal() {
    const prices = document.querySelectorAll("#donation-table-body .price");
    let total = 0;
    prices.forEach((p) => (total += parseFloat(p.dataset.price)));
    document.getElementById(
      "donation-total"
    ).value = `$${total.toLocaleString()}`;
    document.getElementById("total_amount").value = total;
    document.getElementById(
      "total_amount"
    ).textContent = `$${total.toLocaleString()}`;
  }

  // Checkboxes initialized
  document.querySelectorAll('input[name="product"]').forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });

  function removePathSegment(segment) {
    const pathParts = window.location.pathname.split("/");
    const index = pathParts.indexOf(segment);
    if (index !== -1) {
      const newPath = pathParts.slice(0, index).join("/") || "/";
      const newUrl = newPath + window.location.search + window.location.hash;
      history.replaceState({}, "", newUrl);
    }
  }

  function checkOptionsFromParams() {
    const pathParts = window.location.pathname.split("/");

    // Get options from pathname
    let optionsRaw = "";
    const optionsIndex = pathParts.indexOf("options");
    if (optionsIndex !== -1 && pathParts[optionsIndex + 1]) {
      optionsRaw = decodeURIComponent(pathParts[optionsIndex + 1]).replace(
        /\+/g,
        " "
      );
    }

    if (optionsRaw) {
      const options = optionsRaw
        .split(",")
        .map((opt) => opt.trim().toLowerCase());
      options.forEach((option) => {
        const checkboxInput = Array.from(
          document.querySelectorAll("input[type='checkbox']")
        ).find(
          (lbl) => lbl.value.split("-")[0].trim().toLowerCase() === option
        );

        if (checkboxInput && checkbox.type === "checkbox") {
          checkboxInput.checked = true;
          handleCheckboxChange({ target: checkbox });
        }
      });

      removePathSegment("options");
    }

    // Get amount from pathname
    const amountIndex = pathParts.indexOf("amount");
    let amount = null;
    if (amountIndex !== -1 && pathParts[amountIndex + 1]) {
      const raw = decodeURIComponent(pathParts[amountIndex + 1]).replace(
        /[^\d]/g,
        ""
      );
      amount = parseInt(raw, 10);
    }

    if (amount && !isNaN(amount)) {
      const tableBody = document.getElementById("donation-table-body");
      const rowId = `row-amount`;
      const row = document.createElement("tr");
      row.id = rowId;
      row.innerHTML = `
      <td>
        <button class="remove-btn" title="Remove donation" aria-label="Remove ${amount}">&#x2715;</button>
      </td>
      <td>General Donation</td>
      <td class="price" data-price="${amount}">$${amount.toLocaleString()}</td>
    `;
      tableBody.appendChild(row);

      row.querySelector(".remove-btn").addEventListener("click", () => {
        row.remove();
        updateTotal();
      });

      updateTotal();
      removePathSegment("amount");
    }
  }

  checkOptionsFromParams();

  let selectedAmount = null;

  // Button click handler
  document.querySelectorAll(".amount-btn").forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active state from all buttons
      document
        .querySelectorAll(".amount-btn")
        .forEach((btn) => btn.classList.remove("selected"));

      // Add active state to selected button
      button.classList.add("selected");

      const amount = button.dataset.amount;

      if (amount === "other") {
        document.getElementById("other-input").style.display = "block";
        selectedAmount = null; // wait until user types
      } else {
        document.getElementById("other-input").style.display = "none";
        selectedAmount = parseInt(amount);
      }
    });
  });

  // Donate button
  document.getElementById("donate-now").addEventListener("click", () => {
    if (
      document.querySelector(".amount-btn.selected")?.dataset.amount === "other"
    ) {
      selectedAmount = parseInt(document.getElementById("other-amount").value);
    }

    if (!selectedAmount || isNaN(selectedAmount)) {
      alert("Please select or enter a valid amount");
      return;
    }

    // Redirect with amount in query params
    const url = `/templates/articlecco_cdo/aid/6970745/jewish/Donations.htm?amount=${encodeURIComponent(
      selectedAmount
    )}`;
    window.location.href = url;
  });

  // Testimonials functionality
  const testimonialItems = document.querySelectorAll(".testimonial-item");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    // Remove active class from all testimonials and dots
    testimonialItems.forEach((item, i) => {
      item.classList.remove("active", "prev");
      if (i < index) {
        item.classList.add("prev");
      }
    });
    dots.forEach((dot) => dot.classList.remove("active"));

    // Add active class to current testimonial and dot
    testimonialItems[index].classList.add("active");
    dots[index].classList.add("active");

    currentTestimonial = index;
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonialItems.length;
    showTestimonial(next);
  }

  function prevTestimonial() {
    const prev =
      (currentTestimonial - 1 + testimonialItems.length) %
      testimonialItems.length;
    showTestimonial(prev);
  }

  function startAutoPlay() {
    testimonialInterval = setInterval(nextTestimonial, 4000);
  }

  function stopAutoPlay() {
    clearInterval(testimonialInterval);
  }

  // Event listeners for testimonial navigation
  nextBtn.addEventListener("click", () => {
    stopAutoPlay();
    nextTestimonial();
    startAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    stopAutoPlay();
    prevTestimonial();
    startAutoPlay();
  });

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopAutoPlay();
      showTestimonial(index);
      startAutoPlay();
    });
  });

  // Pause auto-play on hover
  const testimonialsSection = document.querySelector(".testimonials");
  testimonialsSection.addEventListener("mouseenter", stopAutoPlay);
  testimonialsSection.addEventListener("mouseleave", startAutoPlay);

  // Start auto-play
  startAutoPlay();

  // Mobile menu functionality
  const burgerMenu = document.getElementById("burger-menu");
  const navMenu = document.getElementById("nav-menu");

  function toggleMobileMenu() {
    burgerMenu.classList.toggle("active");
    navMenu.classList.toggle("active");
  }

  function closeMobileMenu() {
    burgerMenu.classList.remove("active");
    navMenu.classList.remove("active");
  }

  // Event listeners for mobile menu
  burgerMenu.addEventListener("click", toggleMobileMenu);

  // Close menu when clicking on nav links
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close menu on window resize if screen becomes larger
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
});
