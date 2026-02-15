const API_URL = "http://localhost:5000/api/leads";
function showMessage(text, type) {
    const box = document.getElementById("messageBox");
    box.textContent = text;
    box.className = `message ${type} show`;
    setTimeout(() => {
        box.classList.remove("show");
    }, 3000);
}
function searchLeads(query) {
    fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
        renderLeads(data);
    })
    .catch(err => {
        console.error(err);
        showMessage("Search failed", "error");
    });
}
function handleSearch() {
    const query = document.getElementById("searchInput").value.trim();
    if(query === "") {
        loadLeads();
    } else {
        searchLeads(query);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");

    const btn = document.getElementById("addLeadBtn");
    btn.addEventListener("click", addLead);

    loadLeads();  // load existing leads on page load
});
function addLead() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const source = document.getElementById("source").value;
    const phone = document.getElementById("phone").value;
    setLoading("addLeadBtn", "Saving...");
    if(!validateLead(name, email, phone)) {
        stopLoading("addBtn");
    }
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name, email, source, phone})
    })
    .then(res => {
        if (!res.ok) throw new Error("Add failed");
        return res.json();
    })
    .then(data => {
        showMessage(data.message, "success");
        loadLeads();   //refresh table
        document.getElementById("leadForm").reset();
    })
    .catch(() => {
        showMessage("Failed to add lead", "error");
    })
    .finally(() => {
        stopLoading("addLeadBtn");
    });
}
let currentPage = 1;
let totalPages = 1;
const limit =5;
console.log("FINAL URL:", `${API_URL}?page=${currentPage}$limit=${limit}`);
function loadLeads() {
    fetch(`${API_URL}?page=${currentPage}&limit=${limit}`)
        .then(res => res.json())
        .then(data => {
            renderLeads(data.leads);
            currentPage = data.currentPage;
            totalPages = data.totalPages;
            updatePaginationButtons();
            document.getElementById("pageInfo").innerText = `page ${currentPage} of ${totalPages}`;
        })
        .catch(err => console.error(err));
    /*fetch(API_URL)
      .then(res => res.json())
      .then(data => renderLeads(data))
      .catch(err => console.error(err)); */
}
function renderLeads(leads) {
    const tbody = document.getElementById("leadsTableBody");
    tbody.innerHTML = "";
    if (!leads || leads.length ===0){
        tbody.innerHTML = `<tr><td>No Leads Found</td></tr>`;
        return;
    }

    leads.forEach(lead => {
        const row = document.createElement("tr");
        row.innerHTML = `
           <td>${lead.id}</td>
           <td>${lead.name}</td>
           <td>${lead.email}</td>
           <td>${lead.source}</td>
           <td>${lead.phone}</td>
           <td>
             <button onclick="editLead(${lead.id}, '${lead.name}', '${lead.email}', '${lead.source}', '${lead.phone}')">Edit</button>
             <button onclick="deleteLead(${lead.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function editLead(id, name, email, source, phone) {
    document.getElementById("editId").value = id;
    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editSource").value = source;
    document.getElementById("editPhone").value = phone;
    openModal();
}
function updateLead() {
    const id = document.getElementById("editId").value;
    const name = document.getElementById("editName").value;
    const email = document.getElementById("editEmail").value;
    const source = document.getElementById("editSource").value;
    const phone = document.getElementById("editPhone").value;
    setLoading("updateBtn", "Updating...");
    if (!validateLead(name, email, phone)) {
        stopLoading("updateBtn");
        return;
    }
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, source, phone})
    })
    .then(res => res.json())
    .then(data => {
        showMessage("Lead Updated", "success");
        closeModal();
        loadLeads();  //refresh table
    })
    .catch(err => {
        showMessage("Failed to update lead", "error");
    })
    .finally(() => {
        stopLoading("updateBtn");
    });
}
function closeModal() {
    const modal = document.getElementById("editModal");
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}
function deleteLead(id) {
    if(!confirm("Are you sure you want to delete this lead?")) return;

    fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    })
    .then(res => res.json())
    .then(data => {
        showMessage("Lead deleted", "success");
        loadLeads();
    })
    .catch(() => {
        showMessage("Delete failed", "error");
    });
}
function openModal() {
    const modal = document.getElementById("editModal");
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}
function setLoading(buttonId, text) {
    const btn = document.getElementById(buttonId);
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.textContent = text;
}
function stopLoading(buttonId) {
    const btn = document.getElementById(buttonId);
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText;
} 
function validateLead(name, email, phone) {
    if(!name || !email || !source || !phone){
        showMessage("All fields are required", "error");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        showMessage("Invalid email address", "error");
        return false;
    }
    if (phone.length !== 10 || isNaN(phone)) {
        showMessage("Phone must be 10 digits", "error");
        return false;
    }
    return true;
}
function updatePaginationButtons() {
    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");
    //Disable Back on first page
    backBtn.disabled = currentPage <= 1;
    //Disable Next on last page 
    nextBtn.disabled = currentPage >= totalPages;
}
function nextPage() {
   if (currentPage < totalPages) {
    currentPage++;
    loadLeads();
   }
}
function prevPage() {
    if(currentPage > 1) {
        currentPage--;
        loadLeads();
    }
}
