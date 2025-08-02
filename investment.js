const FINNHUB_API_KEY = "d2549q1r01qns40d3tc0d2549q1r01qns40d3tcg";
const OPENAI_API_KEY = "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";




document.addEventListener("DOMContentLoaded", async () => {
  const user = localStorage.getItem("activeUser") || "زائر";
  document.getElementById("userNameDisplay").textContent = `مرحبًا ${user}`;

  // تحميل الأرصدة والمحافظ من التخزين
  let balances = JSON.parse(localStorage.getItem("balances") || "{}");
  let portfolios = JSON.parse(localStorage.getItem("portfolios") || "{}");

  if (!balances[user]) balances[user] = 10000; // رصيد افتراضي
  if (!portfolios[user]) portfolios[user] = {}; // محفظة فارغة

  localStorage.setItem("balances", JSON.stringify(balances));
  localStorage.setItem("portfolios", JSON.stringify(portfolios));

  document.getElementById("balanceDisplay").textContent = balances[user].toFixed(2);

  // أسهم لعرضها
  const symbols = ["AAPL", "TSLA", "MSFT", "AMZN", "GOOGL"];
  const tbody = document.querySelector("#stocksTable tbody");

  for (let symbol of symbols) {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const data = await res.json();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${symbol}</td>
      <td>${data.c.toFixed(2)}$</td>
      <td style="color:${data.d >= 0 ? 'green' : 'red'}">${data.d.toFixed(2)}</td>
      <td>
        <input type="number" id="qty-${symbol}" min="1" value="1" style="width:60px;">
        <button onclick="buyStock('${symbol}', ${data.c})">شراء</button>
        <button onclick="sellStock('${symbol}', ${data.c})">بيع</button>
        <button onclick="askAdvice('${symbol}', ${data.c}, ${data.d})">توصية</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  // شراء سهم
  window.buyStock = (symbol, price) => {
    const qty = parseInt(document.getElementById(`qty-${symbol}`).value);
    const total = qty * price;

    if (balances[user] < total) {
      alert("الرصيد غير كافي");
      return;
    }

    balances[user] -= total;
    portfolios[user][symbol] = (portfolios[user][symbol] || 0) + qty;

    localStorage.setItem("balances", JSON.stringify(balances));
    localStorage.setItem("portfolios", JSON.stringify(portfolios));

    alert(`✅ تم شراء ${qty} من ${symbol}`);
    location.reload();
  };

  // بيع سهم
  window.sellStock = (symbol, price) => {
    const qty = parseInt(document.getElementById(`qty-${symbol}`).value);

    if (!portfolios[user][symbol] || portfolios[user][symbol] < qty) {
      alert("⚠️ لا تملك العدد الكافي من الأسهم للبيع");
      return;
    }

    portfolios[user][symbol] -= qty;
    balances[user] += qty * price;

    localStorage.setItem("balances", JSON.stringify(balances));
    localStorage.setItem("portfolios", JSON.stringify(portfolios));

    alert(`💰 تم بيع ${qty} من ${symbol}`);
    location.reload();
  };

  // طلب توصية ذكية
  window.askAdvice = async (symbol, price, change) => {
    const adviceBox = document.getElementById("adviceBox");
    adviceBox.textContent = "🔮 جاري جلب التوصية...";
    
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "أنت مرشد مالي ذكي، تعطي توصيات مبسطة للمبتدئين في سوق الأسهم." },
            { role: "user", content: `السهم: ${symbol}، السعر: ${price}$، التغير: ${change}. أعطني توصية مختصرة: هل أشتري، أبيع، أم أحتفظ؟` }
          ]
        })
      });

      const data = await res.json();
      adviceBox.textContent = `🔮 توصية ${symbol}: ${data.choices[0].message.content}`;
    } catch (error) {
      adviceBox.textContent = "❌ حدث خطأ أثناء جلب التوصية";
      console.error(error);
    }
  };
});
