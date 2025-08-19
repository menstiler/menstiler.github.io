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

  function updateTotal() {
    const otherAmountCheckbox = document.querySelector(".form-checkbox-other"),
      otherAmountInput = document.querySelector(".form-checkbox-other-input");
    otherAmountCheckbox.checked = true;
    if (
      (otherAmountCheckbox && otherAmountCheckbox.checked, otherAmountInput)
    ) {
      let overallTotal = 0;
      document
        .querySelectorAll("#donation-table-body tr .qty-input")
        .forEach((cell) => {
          const qty = parseInt(cell.value),
            priceCell = cell.closest("tr").querySelector(".price"),
            price = Number(priceCell.textContent.replace(/[$,]/g, "")),
            name = cell.parentElement.previousElementSibling
              .querySelector("div:nth-child(2)")
              .textContent.trim()
              .toLowerCase();
          if ("general donation" === name) {
            overallTotal += price;
            return;
          }
          const item = Array.from(
              document.querySelectorAll(".form-checkbox")
            ).find(
              (e) =>
                e.value
                  .substring(0, e.value.lastIndexOf("-"))
                  .trim()
                  .toLowerCase() === name
            ),
            itemValue = parseFloat(item.value.replace(/[^0-9.]/g, ""));
          if (isNaN(qty) || isNaN(price)) {
            return;
          } else {
            overallTotal += price;
            if (item && item.checked) {
              overallTotal -= itemValue;
            }
          }
        }),
        (otherAmountInput.value = overallTotal),
        otherAmountInput.dispatchEvent(
          new Event("change", {
            bubbles: !0,
          })
        );
    }
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
      const str = el.innerHTML;
      const lastIndex = str.lastIndexOf("-");

      if (lastIndex !== -1) {
        const before = str.slice(0, lastIndex);
        const after = str.slice(lastIndex + 1);

        el.innerHTML = `<div>${before}</div><div>${after}</div>`;
      }
    }
    var spanText = el.innerText.toLowerCase();
    if (spanText.includes("reserved") || spanText.includes("dedicated")) {
      el.closest(".form-checkbox-item").classList.add("reserved-dedication");
    }
  });

  // Scrape dedications from another page
  async function styleDedicationTable() {
    try {
      const table = document.getElementById("dedications");
      if (!table) return;
      table.style.display = "none";

      const container = document.getElementById("dedication-list");
      const rows = table?.querySelectorAll("tr") || [];
      const categories = {};
      const sessionItems = [];

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        if (cells.length < 4) continue;

        const name = cells[0].textContent.trim();
        const price = cells[1].textContent.trim();
        const qty = cells[2].textContent.trim();
        const checkbox = cells[3].textContent.trim().toLowerCase();
        const reserved = checkbox === "yes" || false;
        const category = cells[4].textContent.trim();
        if (!name || !category) continue;

        const item = { name, price, reserved, qty };
        sessionItems.push(item);
        if (!categories[category]) categories[category] = [];
        categories[category].push(item);
      }

      sessionStorage.setItem("dedications", JSON.stringify(sessionItems));

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
          priceEl.textContent = item.price;

          priceAndBtn.appendChild(priceEl);

          let actionEl;
          if (item.reserved) {
            actionEl = document.createElement("span");
            actionEl.textContent = "Reserved";
            actionEl.className = "dedicate-disabled";
          } else {
            actionEl = document.createElement("a");
            actionEl.href = `/templates/articlecco_cdo/aid/6970745/jewish/Donations.htm?${new URLSearchParams(
              { name: item.name }
            )}`;
            if (parseFloat(item.qty) > 1) {
              actionEl.textContent = `${item.qty} Dedications`;
            } else {
              actionEl.textContent = "Dedicate";
            }
            actionEl.className = "dedicate-link";
          }

          priceAndBtn.appendChild(actionEl);
          itemDiv.appendChild(priceAndBtn);
          categoryContainer.appendChild(itemDiv);
        });
        container.appendChild(section);
      }

      /** ------------ Progress Table ------------ **/
      const progressHeader = document.querySelectorAll(".campaign-progress h4");
      if (progressHeader) {
        const raisedElement = document.querySelectorAll(
          ".campaign-progress h4"
        )[0];
        const goalElement = document.querySelectorAll(
          ".campaign-progress h4"
        )[1];
        let goal = 0;
        let raised = 0;

        const raisedValue = parseFloat(
          raisedElement.textContent.split(" ")[0].replace(/[^0-9.]/g, "")
        );
        const goalValue = parseFloat(
          goalElement.textContent.split(" ")[1].replace(/[^0-9.]/g, "")
        );
        goal = goalValue;
        raised = raisedValue;

        if (goal && raised) {
          const percent = Math.min((raised / goal) * 100, 100);

          // Update DOM
          const bar = document.querySelectorAll(".progress-bar");

          if (bar.length > 0) {
            bar.forEach(function (el) {
              el.style.width = `${percent}%`;
              el.setAttribute("aria-valuenow", percent.toFixed(0));
            });
          }
        }
      }
    } catch (err) {
      console.error("Error loading dedications:", err);
    }
  }

  styleDedicationTable();

  // Handle checkbox changes
  function handleCheckboxChange(event) {
    const checkbox = event.target;
    const name = (
      checkbox.value.slice(0, checkbox.value.lastIndexOf("-")) || checkbox.value
    ).trim();
    const price = checkbox.value.split("-").pop().trim();
    const tableBody = document.getElementById("donation-table-body");
    const rowId = `row-${name.replace(/\s+/g, "-")}`;

    const sessionDedication = JSON.parse(
      sessionStorage.getItem("dedications")
    ).find((item) => item.name === name);
    const qty = sessionDedication.qty ? sessionDedication.qty : 1;

    if (checkbox.checked) {
      const row = document.createElement("tr");
      row.id = rowId;
      row.innerHTML = `
          <td>
            <div>            
            <button class="remove-btn" title="Remove donation" aria-label="Remove ${name}">&#x2715;</button>
            </div>
            <div>
            ${name}
            </div>
          </td>
          <td>
          <input class="qty-input" id='qty-input' min="0" max=${qty} step="1" type="number" value="1"  />
          </td>
          <td class="price" data-price="${price}">${price.toLocaleString()}</td>
        `;
      tableBody.appendChild(row);

      function deleteRow() {
        row.remove();
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      }

      row.querySelector(".qty-input").addEventListener("change", (e) => {
        const value = parseInt(e.target.value);
        if (value === 0) {
          deleteRow();
          return;
        }
        const total = parseFloat(value) * Number(price.replace(/[$,]/g, ""));
        row.querySelector(".price").textContent = `$${total.toLocaleString()}`;
        updateTotal();
        row.dispatchEvent(new Event("change", { bubbles: true }));
      });

      row.querySelector(".remove-btn").addEventListener("click", () => {
        deleteRow();
      });
    } else {
      const existingRow = document.getElementById(rowId);
      if (existingRow) existingRow.remove();
    }
  }

  // Checkboxes initialized
  document.querySelectorAll('input[name="q1_input1[]"]').forEach((checkbox) => {
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
    const optionsIndex = pathParts.indexOf("name");
    if (optionsIndex !== -1 && pathParts[optionsIndex + 1]) {
      optionsRaw = decodeURIComponent(pathParts[optionsIndex + 1]).replace(
        /\+/g,
        " "
      );
    }

    if (optionsRaw) {
      const option = optionsRaw.toLowerCase();
      const checkboxInput = Array.from(
        document.querySelectorAll("input[type='checkbox']")
      ).find(
        (lbl) =>
          (lbl.value.slice(0, lbl.value.lastIndexOf("-")) || lbl.value)
            .trim()
            .toLowerCase() === option
      );

      if (checkboxInput && checkboxInput.type === "checkbox") {
        checkboxInput.checked = true;
        handleCheckboxChange({ target: checkboxInput });
      }

      removePathSegment("name");
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
      const otherAmountCheckbox = document.querySelector(
        ".form-checkbox-other"
      );
      const otherAmountInput = document.querySelector(
        ".form-checkbox-other-input"
      );
      otherAmountCheckbox.checked = true;
      otherAmountInput.value = amount;
      const tableBody = document.getElementById("donation-table-body");
      const rowId = `row-amount`;
      const row = document.createElement("tr");
      row.id = rowId;
      row.innerHTML = `
      <td>
        <div>
        <button class="remove-btn" title="Remove donation" aria-label="Remove ${amount}">&#x2715;</button>
        </div>
        <div>
          General Donation
        </div>
      </td>   
      <td>
      <input class="qty-input" min="0" step="1" type="number" value="1"/>
      </td>
      <td class="price" data-price="${amount}">$${amount.toLocaleString()}</td>
    `;
      tableBody.appendChild(row);

      function deleteRow() {
        row.remove();
        otherAmountCheckbox.checked = false;
        otherAmountCheckbox.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }

      row.querySelector(".qty-input").addEventListener("change", (e) => {
        const value = parseInt(e.target.value);
        if (value === 0) {
          deleteRow();
          return;
        }
        const otherAmountCheckbox = document.querySelector(
          ".form-checkbox-other"
        );
        const otherAmountInput = document.querySelector(
          ".form-checkbox-other-input"
        );
        otherAmountCheckbox.checked = true;
        const total = parseFloat(value) * amount;
        row.querySelector(".price").textContent = `$${total.toLocaleString()}`;
        otherAmountInput.value = total;
        updateTotal();
        otherAmountCheckbox.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      });

      row.querySelector(".remove-btn").addEventListener("click", () => {
        deleteRow();
      });

      removePathSegment("amount");
    }
  }

  checkOptionsFromParams();

  const totalTargetNode = document.querySelector("#total_amount");

  if (totalTargetNode) {
    // Create an observer instance
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          document.getElementById("donation-total").textContent = parseFloat(
            totalTargetNode.textContent.replace("$", "")
          ).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
        }
      }
    });

    // Start observing
    observer.observe(totalTargetNode, {
      childList: true, // detect if child nodes are added/removed
      characterData: true, // detect text node changes
      subtree: true, // include nested elements
    });
  }

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
  const donateNowBtn = document.getElementById("donate-now");
  donateNowBtn &&
    donateNowBtn.addEventListener("click", () => {
      if (
        document.querySelector(".amount-btn.selected")?.dataset.amount ===
        "other"
      ) {
        selectedAmount = parseInt(
          document.getElementById("other-amount").value
        );
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

  // Mobile menu functionality
  const burgerMenu = document.getElementById("burger-menu");
  const navMenu = document.getElementById("navigation");

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

  document.addEventListener(
    "click",
    function onDocClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return; // ignore plain "#" anchors

      const target = document.querySelector(hash);
      if (!target) return; // no on-page target

      // prevent default jump and stop other listeners
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      // compute header height dynamically (change selector to match your header)
      const header =
        document.querySelector(".sticky-top") ||
        document.querySelector("header");
      const headerOffset = header ? header.offsetHeight : 0;

      // compute absolute position of target and subtract header height
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - headerOffset - 8; // extra 8px padding

      // smooth scroll
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });

      // accessibility: focus target without causing extra scroll
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });

      // update the URL hash without triggering jump
      if (history.pushState) {
        history.pushState(null, "", hash);
      } else {
        location.hash = hash;
      }
    },
    true
  );

  if (document.body.classList.contains("section_root")) {
    const addLinks = `
            <li class="item parent"><a href="#campaign" class="parent">Campaign</a></li>
            <li class="item parent"><a href="#timeline" class="parent">Timeline</a></li>
            <li class="item parent"><a href="#donations" class="parent">Dedications</a></li>
            <li class="item parent"><a href="#contact" class="parent">Contact</a></li>
            `;

    if (jQuery("#navigation #menu .item a").first().text().trim() === "Menu") {
      jQuery("#navigation #menu .item").first().remove();
    }

    if (jQuery("#navigation #menu .item a").first().text().trim() === "Home") {
      jQuery("#navigation #menu .item").first().after(addLinks);
    } else {
      jQuery("#navigation #menu").prepend(addLinks);
    }
  }
});

function setUpTestimonials() {
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
}
