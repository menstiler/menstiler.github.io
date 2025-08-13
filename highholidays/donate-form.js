const url =
  "https://bihxghuhlw6ffmdbkkrt2ofxd40pqdon.lambda-url.us-east-2.on.aws/?id=1DwHmQF6J60S126sWqG_-kpxpRcgO4201IjHgAqGeHdU";

function getFromSheet() {
  try {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const bar = document.querySelector(".progress-bar");
        const label = document.querySelector(".campaign-progress h4");
        const percentEl = document.querySelector(".campaign-progress .percent");
        const donors = data.values.reverse();
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

        donors.forEach(([name, amount, dedication, current, goal], index) => {
          if (index !== donors.length - 1) {
            const li = document.createElement("li");
            li.className = "donor-item";
            li.innerHTML = `<div class="name">${name}</div><div class="amount"> $${amount.toLocaleString()}</div>${
              dedication ? `<div class="dedication">${dedication}</div>` : ""
            }`;
            tickerTrack.appendChild(li);

            if (current && goal) {
              const amountNumber = parseInt(current, 10);
              const goalNumber = parseInt(goal, 10);
              const percent = (amountNumber / goalNumber) * 100;

              if (bar) {
                bar.style.width = `min(calc(${percent}% + 45px), 100%)`;
                bar.setAttribute("aria-valuenow", percent);
              }

              if (label) {
                label.textContent = `$${amountNumber.toLocaleString()} OF $${goalNumber.toLocaleString()} RAISED`;
              }

              if (percentEl) {
                const percentDisplay =
                  percent >= 1 ? percent.toFixed(0) : percent;
                percentEl.textContent = `${percentDisplay}%`;
              }
            }
          }
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
                    duplicate: false,
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

function headerSetup() {
  const articleHeader = jQuery(".master-content-wrapper");

  articleHeader.append(
    `<div class="campaign-article">some text about the campaign</div>`
  );
  articleHeader.append(`<div class="campaign-progress">
              <h4>
                $0 OF $0 RAISED
              </h4>
              <div class="progress-bar-container">
                <div class="progress-bar"><span class="percent"></span></div>
              </div>
            </div>
            <div class="ticker-container">
              <ul class="ticker-track">
              </ul>
            </div>
            `);
}

function init() {
  pageSetup();
  headerSetup();
  getFromSheet();
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
