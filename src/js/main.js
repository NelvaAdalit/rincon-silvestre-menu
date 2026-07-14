// --- INTERACTIVE MENU LOGIC FOR RINCÓN SILVESTRE ---

// 1. Menu Items Data
const menuData = {
  cortes: [
    {
      id: "c1",
      title: "Picaña de Res (Corte Especial)",
      desc: "Jugoso corte de res seleccionado con su capa de grasa perfecta a la parrilla, acompañado de chimichurri de la casa.",
      price: 75,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "c2",
      title: "Ojo de Bife",
      desc: "Tierno y jugoso centro de lomo alto a la parrilla, asado al término que prefieras.",
      price: 65,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "c3",
      title: "Bife de Chorizo",
      desc: "El clásico corte argentino, sabroso, grueso y con el dorado ideal por fuera.",
      price: 60,
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "c4",
      title: "Churrasco Tradicional",
      desc: "Filete de res a la parrilla sazonado con sal parrillera al punto exacto de cocción.",
      price: 50,
      image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=300&auto=format&fit=crop&q=60"
    }
  ],
  guarniciones: [
    {
      id: "g1",
      title: "Arroz con Queso",
      desc: "El tradicional arroz batido cruceño con abundante queso y leche, cremoso y caliente.",
      price: 15,
      image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "g2",
      title: "Papas Fritas Crujientes",
      desc: "Papas cortadas a mano, doradas y crujientes por fuera, suaves por dentro.",
      price: 12,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "g3",
      title: "Yuca Frita / Cocida",
      desc: "Yucas locales servidas cocidas suaves o fritas super crocantes.",
      price: 10,
      image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "g4",
      title: "Ensalada Rústica Fresca",
      desc: "Mezcla de lechuga orgánica, tomate jugoso y cebolla morada con aderezo parrillero.",
      price: 10,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=60"
    }
  ],
  bebidas: [
    {
      id: "b1",
      title: "Coca-Cola Familiar 2 Litros",
      desc: "Helada y lista para compartir con todo el grupo.",
      price: 15,
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "b2",
      title: "Jarra de Jugo Natural",
      desc: "Elige tu fruta favorita: Limón, Naranja, Maracuyá o Carambola. Exprimido al instante.",
      price: 20,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "b3",
      title: "Cerveza Huari (620ml)",
      desc: "La cerveza nacional de calidad premium hecha con agua de vertiente.",
      price: 22,
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: "b4",
      title: "Agua Mineral Embotellada",
      desc: "Agua mineralizada local, disponible con o sin gas (500ml).",
      price: 8,
      image: "./agua_mineral.png"
    }
  ]
};

// 2. Global State
let cart = {}; // format: { itemId: quantity }
const rincónWhatsappNumber = "59173418452"; // Actual WhatsApp from TikTok

// 3. Elements selector
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  setupTabs();
  setupEventListeners();
  updateCartUI();

  // Set up Joinchat link dynamically
  const joinchatLink = document.getElementById("whatsapp-joinchat");
  if (joinchatLink) {
    joinchatLink.href = `https://api.whatsapp.com/send?phone=${rincónWhatsappNumber}&text=${encodeURIComponent("Hola Rincón Silvestre, tengo una consulta...")}`;
  }
});

// 4. Render Menu Dynamically
function renderMenu() {
  const sections = {
    cortes: document.getElementById("items-cortes"),
    guarniciones: document.getElementById("items-guarniciones"),
    bebidas: document.getElementById("items-bebidas")
  };

  for (const category in menuData) {
    if (sections[category]) {
      sections[category].innerHTML = "";
      menuData[category].forEach(item => {
        const itemHtml = `
          <div class="menu-card" data-item-id="${item.id}">
            <img class="menu-card-image" src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="menu-card-details">
              <div>
                <h4 class="menu-item-title">${item.title}</h4>
                <p class="menu-item-desc">${item.desc}</p>
              </div>
              <div class="menu-item-bottom">
                <span class="menu-item-price">${item.price} Bs.</span>
                <div class="quantity-control">
                  <button class="qty-btn minus" onclick="changeQty('${item.id}', -1)">−</button>
                  <span class="qty-val" id="qty-${item.id}">0</span>
                  <button class="qty-btn plus" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
              </div>
            </div>
          </div>
        `;
        sections[category].insertAdjacentHTML("beforeend", itemHtml);
      });
    }
  }
}

// 5. Change Item Quantity in Cart
window.changeQty = function(itemId, amount) {
  const currentQty = cart[itemId] || 0;
  const newQty = Math.max(0, currentQty + amount);

  if (newQty === 0) {
    delete cart[itemId];
  } else {
    cart[itemId] = newQty;
  }

  // Update DOM quantity counter for this item
  const counter = document.getElementById(`qty-${itemId}`);
  if (counter) counter.innerText = newQty;

  updateCartUI();
};

// 6. Update Sticky Cart Totals
function updateCartUI() {
  let totalItems = 0;
  let totalPrice = 0;

  // Calculate totals
  for (const itemId in cart) {
    const qty = cart[itemId];
    const item = findItemById(itemId);
    if (item) {
      totalItems += qty;
      totalPrice += item.price * qty;
    }
  }

  // Update HTML elements
  const countLabel = document.getElementById("cart-count-val");
  const priceLabel = document.getElementById("cart-total-val");
  const btnCheckout = document.getElementById("btn-checkout");

  if (countLabel) countLabel.innerText = `${totalItems} ${totalItems === 1 ? 'ítem' : 'ítems'}`;
  if (priceLabel) priceLabel.innerText = `${totalPrice} Bs.`;

  const qrTotalLabel = document.getElementById("qr-total-amount");
  if (qrTotalLabel) qrTotalLabel.innerText = `${totalPrice} Bs.`;

  // Enable/Disable Checkout Button
  if (btnCheckout) {
    if (totalItems > 0) {
      btnCheckout.disabled = false;
      btnCheckout.style.opacity = "1";
      btnCheckout.style.cursor = "pointer";
    } else {
      btnCheckout.disabled = true;
      btnCheckout.style.opacity = "0.6";
      btnCheckout.style.cursor = "not-allowed";
    }
  }
}

// Helper to locate item details by ID
function findItemById(id) {
  for (const category in menuData) {
    const found = menuData[category].find(item => item.id === id);
    if (found) return found;
  }
  return null;
}

// 7. Setup Categories Filter Scroll
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId = tab.dataset.target;
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Smooth scroll to element offset
        const yOffset = -80; // Offset for sticky headers
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // Dynamic active tab highlighting based on scroll position
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 120;
    const sections = ["sec-cortes", "sec-guarniciones", "sec-bebidas"];

    for (let i = 0; i < sections.length; i++) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          tabs.forEach(t => t.classList.remove("active"));
          const activeTab = document.querySelector(`.tab-btn[data-target="${sections[i]}"]`);
          if (activeTab) activeTab.classList.add("active");
        }
      }
    }
  });
}

// 8. Setup Modals & Clicks
function setupEventListeners() {
  const modalReservar = document.getElementById("modal-reservas");
  const modalCheckout = document.getElementById("modal-checkout");

  const btnOpenReservar = document.getElementById("btn-reservar");
  const btnCloseReservar = document.getElementById("close-reservas");
  const btnOpenCheckout = document.getElementById("btn-checkout");
  const btnCloseCheckout = document.getElementById("close-checkout");

  // Open Reservar Modal
  if (btnOpenReservar) {
    btnOpenReservar.addEventListener("click", () => {
      modalReservar.classList.add("active");
    });
  }

  // Close Reservar Modal
  if (btnCloseReservar) {
    btnCloseReservar.addEventListener("click", () => {
      modalReservar.classList.remove("active");
    });
  }

  // Open Checkout Modal
  if (btnOpenCheckout) {
    btnOpenCheckout.addEventListener("click", () => {
      modalCheckout.classList.add("active");
    });
  }

  // Close Checkout Modal
  if (btnCloseCheckout) {
    btnCloseCheckout.addEventListener("click", () => {
      modalCheckout.classList.remove("active");
    });
  }

  // Close modals clicking outside content
  window.addEventListener("click", (e) => {
    if (e.target === modalReservar) modalReservar.classList.remove("active");
    if (e.target === modalCheckout) modalCheckout.classList.remove("active");
  });

  // Handle Reservation Form Submit
  const reservationForm = document.getElementById("reservation-form");
  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      sendReservation();
    });
  }

  // Handle Checkout Form Submit
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      sendOrder();
    });
  }

  // Toggle checkout details fields based on delivery selection
  const serviceType = document.getElementById("checkout-service-type");
  const detailsLabel = document.getElementById("checkout-details-label");
  const detailsInput = document.getElementById("checkout-details");
  const btnGetLocation = document.getElementById("btn-get-location");

  if (serviceType && detailsLabel && detailsInput && btnGetLocation) {
    serviceType.addEventListener("change", () => {
      if (serviceType.value === "mesa") {
        detailsLabel.innerHTML = "Ubicación de la Mesa";
        detailsInput.placeholder = "Ej. Mesa adentro / Mesa en el patio";
        btnGetLocation.style.display = "none";
      } else if (serviceType.value === "llevar") {
        detailsLabel.innerHTML = "Detalle Adicional (Opcional)";
        detailsInput.placeholder = "Ej. Pasar a recoger a las 8:30 PM";
        btnGetLocation.style.display = "none";
      } else {
        detailsLabel.innerHTML = "Dirección de Envío y Ref. <span style='color: #ff5722; font-weight: bold;'>*(Ubicación GPS Requerida)*</span>";
        detailsInput.placeholder = "Ej. Calle Calvo #456, portón verde. ¡Use el botón de abajo para obtener su GPS!";
        btnGetLocation.style.display = "flex";
      }
    });

    btnGetLocation.addEventListener("click", () => {
      if (!navigator.geolocation) {
        showToast("La geolocalización no es compatible con este navegador.");
        return;
      }

      btnGetLocation.disabled = true;
      btnGetLocation.innerText = "Obteniendo ubicación GPS...";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

          detailsInput.value = `${mapsUrl} (Ref: )`;
          showToast("¡Ubicación GPS obtenida con éxito!");

          btnGetLocation.disabled = false;
          btnGetLocation.innerHTML = `<i data-lucide="map-pin" style="width: 14px; height: 14px;"></i> Obtener mi Ubicación GPS`;
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          showToast("No se pudo obtener la ubicación. Escríbela manualmente.");
          btnGetLocation.disabled = false;
          btnGetLocation.innerHTML = `<i data-lucide="map-pin" style="width: 14px; height: 14px;"></i> Obtener mi Ubicación GPS`;
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }
}

// 9. Send Reservation to WhatsApp
function sendReservation() {
  const nombre = document.getElementById("res-name").value;
  const fecha = document.getElementById("res-date").value;
  const hora = document.getElementById("res-time").value;
  const personas = document.getElementById("res-qty").value;
  const ubicacion = document.getElementById("res-location").value;
  const detalles = document.getElementById("res-details").value;

  const locationLabels = {
    adentro: "Mesa adentro (Salón)",
    afuera: "Mesa afuera (Patio / Jardín)"
  };

  let text = `¡Hola Rincón Silvestre! 🔥\nQuiero solicitar una reserva de mesa:\n\n`;
  text += `👤 *Nombre:* ${nombre}\n`;
  text += `📅 *Fecha:* ${fecha}\n`;
  text += `⏰ *Hora:* ${hora}\n`;
  text += `👥 *Personas:* ${personas}\n`;
  text += `📍 *Ubicación:* ${locationLabels[ubicacion]}\n`;
  if (detalles) {
    text += `💬 *Comentario adicional:* ${detalles}\n`;
  }

  // Check if they also pre-ordered items in the cart
  let preOrderText = "";
  let subtotal = 0;
  for (const itemId in cart) {
    const qty = cart[itemId];
    const item = findItemById(itemId);
    if (item) {
      const priceSum = item.price * qty;
      preOrderText += `• ${qty}x ${item.title} (${priceSum} Bs.)\n`;
      subtotal += priceSum;
    }
  }

  if (preOrderText) {
    text += `\n🍖 *PRE-PEDIDO INCLUIDO:* \n${preOrderText}`;
    text += `💰 *Total estimado consumo:* ${subtotal} Bs.\n`;
    
    // Also generate PDF receipt for their pre-order reference
    try {
      generatePDFReceipt(nombre, `reserva-${ubicacion}`, detalles, cart, subtotal);
    } catch (error) {
      console.error("Error al generar el recibo PDF:", error);
    }
  }

  if (preOrderText) {
    text += `\n¿Tienen disponibilidad de mesa y stock de los platos/bebidas solicitados para confirmar? ¡Muchas gracias!`;
  } else {
    text += `\n¿Tienen disponibilidad de mesa para esa fecha y hora? ¡Muchas gracias!`;
  }

  const url = `https://api.whatsapp.com/send?phone=${rincónWhatsappNumber}&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");

  // Success Notification
  showToast("¡Redirigiendo reserva a WhatsApp!");
  document.getElementById("modal-reservas").classList.remove("active");
  document.getElementById("reservation-form").reset();

  if (preOrderText) {
    clearCart();
  }
}

// 10. Send Order to WhatsApp
function sendOrder() {
  const nombre = document.getElementById("checkout-name").value;
  const servicio = document.getElementById("checkout-service-type").value;
  const detalles = document.getElementById("checkout-details").value;

  let text = `¡Hola Rincón Silvestre! 🔥\nQuiero realizar un pedido desde el Menú Web:\n\n`;
  text += `👤 *Cliente:* ${nombre}\n`;

  const serviceLabels = {
    mesa: "Consumir en Mesa",
    llevar: "Para Llevar / Recoger",
    delivery: "Delivery a Domicilio"
  };
  text += `📍 *Tipo de Servicio:* ${serviceLabels[servicio]}\n`;
  text += `📋 *Detalle/Dirección:* ${detalles}\n`;
  if (servicio === "delivery") {
    text += `📍 *Ubicación GPS:* [⚠️ OBLIGATORIO: Adjunte su ubicación en tiempo real/actual aquí en el chat de WhatsApp]\n`;
  }
  text += `\n`;
  text += `🍖 *PEDIDO:* \n`;

  let subtotal = 0;
  for (const itemId in cart) {
    const qty = cart[itemId];
    const item = findItemById(itemId);
    if (item) {
      const priceSum = item.price * qty;
      text += `• ${qty}x ${item.title} (${priceSum} Bs.)\n`;
      subtotal += priceSum;
    }
  }

  text += `\n💰 *Total estimado:* ${subtotal} Bs.\n\n`;
  text += `¿Me confirman disponibilidad de los platos para que pueda realizar el pago por transferencia/QR? ¡Muchas gracias!`;

  // Generate Digital Receipt PDF
  try {
    generatePDFReceipt(nombre, servicio, detalles, cart, subtotal);
  } catch (error) {
    console.error("Error al generar el recibo PDF:", error);
  }

  const url = `https://api.whatsapp.com/send?phone=${rincónWhatsappNumber}&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");

  // Success Notification
  showToast("¡Redirigiendo pedido a WhatsApp!");
  document.getElementById("modal-checkout").classList.remove("active");
  document.getElementById("checkout-form").reset();
  
  // Clear cart
  clearCart();
}

// Helper to clear the cart
function clearCart() {
  cart = {};
  const qtyLabels = document.querySelectorAll(".qty-val");
  qtyLabels.forEach(label => label.innerText = "0");
  updateCartUI();
}

// Helper to show success toast
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// 11. Generate Digital Receipt in PDF format (80mm ticket size)
function generatePDFReceipt(nombre, servicio, detalles, cart, total) {
  if (!window.jspdf) {
    console.error("La librería jsPDF no está cargada.");
    return;
  }

  const { jsPDF } = window.jspdf;
  
  // Calculate page height dynamically based on the number of items in the cart
  const itemCount = Object.keys(cart).length;
  const pageHeight = 100 + (itemCount * 12); // Base height + extra space per item
  
  const doc = new jsPDF({
    unit: "mm",
    format: [80, pageHeight] // 80mm roll width, dynamic height
  });

  const margin = 6;
  let y = 12;

  // Title & Subtitle
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text("RINCÓN SILVESTRE", 40, y, { align: "center" });
  y += 5;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Carnes a la Parrilla • Sabor & Tradición", 40, y, { align: "center" });
  y += 6;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DETALLE DE PEDIDO (Por Confirmar)", 40, y, { align: "center" });
  y += 6;

  // Separator
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("----------------------------------------------------------------------", 40, y, { align: "center" });
  y += 5;

  // Customer & Service Info
  doc.setFont("Helvetica", "bold");
  doc.text("Cliente: ", margin, y);
  doc.setFont("Helvetica", "normal");
  doc.text(nombre, margin + 12, y);
  y += 4;

  const serviceLabels = {
    mesa: "Consumir en Mesa",
    llevar: "Para Llevar / Recoger",
    delivery: "Delivery a Domicilio",
    "reserva-adentro": "Reserva - Mesa Adentro",
    "reserva-afuera": "Reserva - Mesa Afuera"
  };

  doc.setFont("Helvetica", "bold");
  doc.text("Servicio: ", margin, y);
  doc.setFont("Helvetica", "normal");
  doc.text(serviceLabels[servicio] || servicio, margin + 14, y);
  y += 4;

  const detailsLabel = servicio === "mesa" ? "Mesa: " : (servicio === "llevar" ? "Detalle: " : "Dirección: ");
  doc.setFont("Helvetica", "bold");
  doc.text(detailsLabel, margin, y);
  doc.setFont("Helvetica", "normal");
  
  const splitDetails = doc.splitTextToSize(detalles || "-", 50);
  doc.text(splitDetails, margin + 16, y);
  y += splitDetails.length * 4;

  const dateStr = new Date().toLocaleString("es-BO");
  doc.setFont("Helvetica", "bold");
  doc.text("Fecha: ", margin, y);
  doc.setFont("Helvetica", "normal");
  doc.text(dateStr, margin + 11, y);
  y += 5;

  // Separator
  doc.text("----------------------------------------------------------------------", 40, y, { align: "center" });
  y += 5;

  // Table Headers
  doc.setFont("Helvetica", "bold");
  doc.text("Cant  Detalle", margin, y);
  doc.text("Total", 74, y, { align: "right" });
  y += 4;
  doc.setFont("Helvetica", "normal");

  // Cart Items
  for (const itemId in cart) {
    const qty = cart[itemId];
    const item = findItemById(itemId);
    if (item) {
      const priceSum = item.price * qty;
      const itemText = `${qty}x   ${item.title}`;
      const splitTitle = doc.splitTextToSize(itemText, 50);
      
      doc.text(splitTitle, margin, y);
      doc.text(`${priceSum} Bs.`, 74, y, { align: "right" });
      
      y += splitTitle.length * 4;
    }
  }

  // Separator
  doc.text("----------------------------------------------------------------------", 40, y, { align: "center" });
  y += 5;

  // Total amount
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL A PAGAR:", margin, y);
  doc.text(`${total} Bs.`, 74, y, { align: "right" });
  y += 8;

  // Footer
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(9);
  doc.text("¡Gracias por su preferencia! 🔥", 40, y, { align: "center" });
  y += 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Sucre - Bolivia", 40, y, { align: "center" });

  // Download PDF
  const filename = `Recibo_Rincon_${nombre.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
