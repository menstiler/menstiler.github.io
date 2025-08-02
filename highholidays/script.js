const PAGE_SCRIPTS = [
  {
    aid: "ArticleCcoResponse_cdo/aid/6974961",
    href: "https://menstiler.github.io/highholidays/update-sheet.js",
    type: "script",
  },
  {
    aid: "6974961",
    href: "https://menstiler.github.io/highholidays/donate-form.css",
    type: "style",
  },
  {
    aid: "6974961",
    href: "https://menstiler.github.io/highholidays/donate-form.js",
    type: "script",
  },
];

function pageSpecificStyling(url) {
  const styles = document.createElement("link");
  styles.rel = "stylesheet";
  styles.type = "text/css";
  styles.media = "screen";
  styles.href = url;
  document.getElementsByTagName("head")[0].appendChild(styles);
}

function pageSpecificJs(url) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

function injectAsset(rule) {
  if (rule.type === "script") {
    pageSpecificJs(rule.href);
  } else if (rule.type === "style") {
    pageSpecificStyling(rule.href);
  } else if (rule.type === "redirect") {
    window.location.href = rule.href;
  }
}

PAGE_SCRIPTS.forEach((rule) => {
  if (window.location.href.indexOf(rule.aid) !== -1) {
    injectAsset(rule);
  } else {
    localStorage.removeItem("submissionId");
  }
});

function addScrollingIndicator() {
  const $donorsContainer = jQuery("div#donors");

  const latestDonorsEl = document.getElementById("latest-donors");
  latestDonorsEl.addEventListener("scroll", function () {
    $donorsContainer.addClass("scrolled-donors");
  });
}

const url =
  "https://script.google.com/macros/s/AKfycbxuCoaAYacI0hFWUCGFEnOg4uy9zVrJkARU1JikbjiuEVZKMnYC-bNt9XBiJ8ip9LEg/exec";

async function getFromSheet() {
  try {
    await fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        if (data.goal && data.total) {
          const percent = Math.min((data.total / data.goal) * 100, 100);

          // Update DOM
          const bar = document.querySelector(".progress-bar");
          const label = document.querySelector(".campaign-progress h4");
          const percentEl = document.querySelector(
            ".campaign-progress .percent"
          );

          if (bar) {
            bar.style.width = `min(calc(${percent}% + 20px), 100%)`;
            bar.setAttribute("aria-valuenow", percent.toFixed(0));
          }

          if (label) {
            label.textContent = `$${data.total.toLocaleString()} OF $${data.goal.toLocaleString()} RAISED`;
          }

          if (percentEl) {
            percentEl.textContent = `${percent.toFixed(0)}%`;
          }
        }

        const donors = data.rows.reverse();
        const tickerTrack = document.querySelector(".ticker-track");
        tickerTrack.style.display = "none";
        tickerTrack.innerHTML = "";

        if (donors.length > 0) {
          const $latestDonors = jQuery(".ticker-container");
          const newEl = document.createElement("h4");
          newEl.textContent = "Thank you to our latest donors";
          newEl.className = "donors-title";
          $latestDonors[0].parentNode.insertBefore(newEl, $latestDonors[0]);
        }

        donors.forEach((donor) => {
          const li = document.createElement("li");
          li.className = "donor-item";
          li.innerHTML = `<div class="name">${
            donor.displayName
          }</div><div class="amount"> $${donor.amount.toLocaleString()}</div>${
            donor.dedication
              ? `<div class="dedication">${donor.dedication}</div>`
              : ""
          }`;
          tickerTrack.appendChild(li);
        });

        function loadScript(src, callback) {
          const script = document.createElement("script");
          script.src = src;
          script.onload = callback;
          script.onerror = () => console.error(`Failed to load script: ${src}`);
          document.head.appendChild(script);
        }

        loadScript(
          "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
          () => {
            $j = jQuery.noConflict();
            loadScript(
              "https://cdn.jsdelivr.net/gh/mazedigital/Web-Ticker@master/jquery.webticker.min.js",
              () => {
                tickerTrack.style.display = "block";
                $j(function () {
                  $j(".ticker-track").webTicker({
                    speed: 50,
                    direction: "left",
                    startEmpty: true,
                    duplicate: true,
                    hoverpause: true,
                  });
                });
              }
            );
          }
        );
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  } catch (err) {
    console.error("Error:", err);
  }
}

function checkScrollable() {
  const wrapper = document.getElementById("latest-donors-wrapper");
  const inner = document.getElementById("latest-donors");
  if (inner && inner.scrollWidth <= wrapper.clientWidth) {
    wrapper.classList.add("no-scroll");
  } else {
    wrapper.classList.remove("no-scroll");
  }
}

function pageSetup() {
  const divEl = document.createElement("div");
  divEl.id = "amount-display";
  divEl.innerHTML = `<div class="center">${Co.Settings.MosadName} receives</div><div class="amount">$0</div>`;
  document.getElementById("id_19").appendChild(divEl);

  $amountOptions = document.querySelectorAll(".form-radio[name='q21_input21']");
  $amountInput = document.getElementById("input_19");
  $anonymousInput = document.querySelector("input[name='q13_input13[]']");
  $nameInput = document.querySelector("input[name='q23_input23']");
  $displayNameInput = document.querySelector("input[name='q24_input24']");
  $displayAmount = document.querySelector("#amount-display .amount");
  $amountInput.setAttribute("min", "0");

  $amountOptions.forEach((el) =>
    el.addEventListener("change", function (e) {
      if (e.target.value === "Other") {
        $amountInput.setValue("");
        $displayAmount.textContent = "$0";
        $amountInput.focus();
      } else {
        const total = parseFloat(e.target.value.replace("$", ""));
        $amountInput.setValue(total);
        $displayAmount.textContent = total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      }

      $amountInput.dispatchEvent(new Event("change", { bubbles: true }));
    })
  );

  $amountInput.addEventListener("input", function (e) {
    const total = parseFloat(e.target.value);
    let amountToDisplay = parseFloat(e.target.value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    if (isNaN(total)) {
      amountToDisplay = "$0";
    }
    $displayAmount.textContent = amountToDisplay;
  });

  $nameInput.addEventListener("change", function (e) {
    if (!$anonymousInput.checked) {
      $displayNameInput.setValue(e.target.value);
    }
  });

  $anonymousInput.addEventListener("change", function (e) {
    if (e.target.checked) {
      $displayNameInput.setValue("Anonymous");
      $displayNameInput.disable();
    } else {
      $displayNameInput.setValue($nameInput.value);
      $displayNameInput.enable();
    }
  });

  document
    .querySelector(".form-submit-button")
    .addEventListener("click", function (e) {
      if ($amountInput.value <= 0) {
        e.preventDefault();
        e.stopPropagation();
        const divEl = document.createElement("div");
        divEl.classList.add("form-error-message");
        divEl.innerHTML = `<i class="fa fa-fw fa-exclamation-circle"></i>&nbsp; Please add an amount greater than 0<div class="form-error-arrow"><div class="form-error-arrow-inner"></div></div>`;
        $amountInput.after(divEl);
        $amountInput.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
}

async function init() {
  pageSetup();
  await getFromSheet();
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
