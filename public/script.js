// public/script.js
const API_URL = '/api/dishes';

document.addEventListener('DOMContentLoaded', () => {
  loadDishes();
  document.getElementById('dishForm').addEventListener('submit', handleAddDish);
});

async function loadDishes() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    alert('Failed to load dishes');
    return;
  }
  const dishes = await res.json();
  const table = document.getElementById('dishTableBody');
  table.innerHTML = '';

  dishes.forEach(dish => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input value="${escapeHtml(dish.name)}" disabled /></td>
      <td><input value="${escapeHtml((dish.ingredients || []).join(', '))}" /></td>
      <td><input value="${escapeHtml((dish.preparationSteps || []).join(', '))}" /></td>
      <td><input type="number" value="${Number(dish.cookingTime) || 0}" /></td>
      <td><input value="${escapeHtml(dish.origin || '')}" /></td>
      <!-- ✅ Serving column -->
      <td><input type="number" value="${Number(dish.serving ?? 1)}" min="1" step="1" /></td>
      <td>
        <button class="update" onclick="updateDish('${dish._id}', this)">Update</button>
        <button class="delete" onclick="deleteDish('${dish._id}')">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

async function handleAddDish(e) {
  e.preventDefault();
  const form = e.target;

  const payload = {
    name: form.name.value.trim(),
    ingredients: splitCsv(form.ingredients.value),
    preparationSteps: splitCsv(form.preparationSteps.value),
    cookingTime: parseInt(form.cookingTime.value, 10),
    origin: form.origin.value.trim(),
    serving: parseInt(form.serving.value, 10) // ✅ required by schema
  };

  // basic client validation
  if (!payload.name || !payload.ingredients.length || !payload.preparationSteps.length ||
      isNaN(payload.cookingTime) || isNaN(payload.serving) || !payload.origin) {
    alert('Please fill all fields correctly.');
    return;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.status === 201) {
    form.reset();
    loadDishes();
  } else if (res.status === 409) {
    alert('Dish already exists');
  } else {
    const err = await safeJson(res);
    alert('Failed to add dish: ' + (err.message || res.statusText));
  }
}

async function updateDish(id, btn) {
  const row = btn.closest('tr');
  const inputs = row.querySelectorAll('input');

  // index map: 0 name (disabled), 1 ingredients, 2 steps, 3 time, 4 origin, 5 serving
  const updated = {
    name: inputs[0].value.trim(),
    ingredients: splitCsv(inputs[1].value),
    preparationSteps: splitCsv(inputs[2].value),
    cookingTime: parseInt(inputs[3].value, 10),
    origin: inputs[4].value.trim(),
    serving: parseInt(inputs[5].value, 10)
  };

  if (!updated.name || !updated.ingredients.length || !updated.preparationSteps.length ||
      isNaN(updated.cookingTime) || isNaN(updated.serving) || !updated.origin) {
    alert('Please fill all fields correctly before updating.');
    return;
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  });

  if (res.ok) {
    alert('Dish updated successfully.');
    loadDishes();
  } else {
    const err = await safeJson(res);
    alert('Sorry! Failed to update. ' + (err.message || res.statusText));
  }
}

async function deleteDish(id) {
  if (!confirm('Are you sure you want to delete this dish?')) return;

  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.ok) {
    loadDishes();
  } else {
    const err = await safeJson(res);
    alert('Oops! Failed to delete the dish. ' + (err.message || res.statusText));
  }
}

/* ---------- helpers ---------- */
function splitCsv(s) {
  return String(s || '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt!')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function safeJson(res) {
  try { return await res.json(); } catch { return {}; }
}

// expose for inline handlers
window.updateDish = updateDish;
window.deleteDish = deleteDish;
