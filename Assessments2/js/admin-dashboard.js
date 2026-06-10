// ============================================
// HawkSight — Admin Dashboard
// Manages users and their assigned frameworks
// ============================================

class AdminDashboard {
  constructor() {
    this.users = [];
    this.frameworkList = typeof FRAMEWORKS !== 'undefined' ? Object.keys(FRAMEWORKS).map(k => ({id: k, name: FRAMEWORKS[k].shortName, type: FRAMEWORKS[k].type})) : [];
  }

  async loadUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        this.users = await res.json();
      } else {
        console.error('Failed to load users');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async render() {
    await this.loadUsers();
    
    let html = `
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">👑 Admin</span>
            <h2>User <span class="gradient-text">Management</span></h2>
            <p>Create user accounts and assign specific security frameworks to them.</p>
          </div>

          <div style="display:flex;gap:32px;flex-wrap:wrap;margin-top:32px">
            <!-- Create User Form -->
            <div class="card" style="flex:1;min-width:300px;padding:24px;background:var(--card-bg);border:1px solid var(--border-color);border-radius:12px;">
              <h3>Create New User</h3>
              <div class="form-group" style="margin-top:16px">
                <label>Email Address</label>
                <input type="email" id="new-user-email" class="form-control" placeholder="user@example.com" style="width:100%;padding:12px;margin-top:8px;background:var(--bg-dark);border:1px solid var(--border-color);color:white;border-radius:8px;">
              </div>
              <div class="form-group" style="margin-top:16px">
                <label>Password</label>
                <input type="password" id="new-user-password" class="form-control" placeholder="Password" style="width:100%;padding:12px;margin-top:8px;background:var(--bg-dark);border:1px solid var(--border-color);color:white;border-radius:8px;">
              </div>
              <div class="form-group" style="margin-top:16px">
                <label>Role</label>
                <select id="new-user-role" class="form-control" style="width:100%;padding:12px;margin-top:8px;background:var(--bg-dark);border:1px solid var(--border-color);color:white;border-radius:8px;">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button class="btn btn-primary" style="margin-top:24px;width:100%" onclick="adminDashboard.createUser()">Create User</button>
            </div>

            <!-- Users List -->
            <div style="flex:2;min-width:300px;">
              <h3>Existing Users</h3>
              <div style="display:flex;flex-direction:column;gap:16px;margin-top:16px">
                ${this.users.map(u => this.renderUserCard(u)).join('')}
                ${this.users.length === 0 ? '<p>No users found.</p>' : ''}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    return html;
  }

  renderUserCard(user) {
    const isSelf = app.currentUser && app.currentUser.id === user.id;
    const isAdmin = user.role === 'admin';

    let assignmentsHtml = '';
    if (!isAdmin) {
      assignmentsHtml = `
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color)">
          <h4 style="font-size:0.9rem;margin-bottom:8px">Assigned Frameworks:</h4>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${user.assignments.map(aId => {
              const fwName = FRAMEWORKS[aId] ? FRAMEWORKS[aId].shortName : aId;
              return `<span class="tag" style="background:rgba(255,51,102,0.1);border-color:var(--accent-pink);color:var(--accent-pink);display:flex;align-items:center;gap:4px">
                        ${fwName}
                        <span style="cursor:pointer;font-weight:bold" onclick="adminDashboard.removeAssignment(${user.id}, '${aId}')">×</span>
                      </span>`;
            }).join('')}
            ${user.assignments.length === 0 ? '<span style="color:var(--text-secondary);font-size:0.8rem">No frameworks assigned</span>' : ''}
          </div>
          
          <div style="margin-top:12px;display:flex;gap:8px">
            <select id="assign-fw-${user.id}" class="form-control" style="flex:1;padding:8px;background:var(--bg-dark);border:1px solid var(--border-color);color:white;border-radius:4px;">
              <option value="">-- Select Framework --</option>
              ${this.frameworkList.filter(f => !user.assignments.includes(f.id)).map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
            </select>
            <button class="btn btn-secondary btn-sm" onclick="adminDashboard.addAssignment(${user.id})">Assign</button>
          </div>
        </div>
      `;
    } else {
      assignmentsHtml = `<div style="margin-top:16px;font-size:0.85rem;color:var(--text-secondary)">Admins have access to all frameworks.</div>`;
    }

    return `
      <div class="card" style="padding:16px;background:var(--card-bg);border:1px solid var(--border-color);border-radius:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>${user.email}</strong>
            ${isSelf ? '<span class="tag" style="margin-left:8px">You</span>' : ''}
          </div>
          <span class="type-badge ${isAdmin ? 'type-compliance' : 'type-framework'}">${user.role.toUpperCase()}</span>
        </div>
        ${assignmentsHtml}
      </div>
    `;
  }

  async createUser() {
    const email = document.getElementById('new-user-email').value;
    const password = document.getElementById('new-user-password').value;
    const role = document.getElementById('new-user-role').value;

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        alert("User created successfully!");
        app.showAdminDashboard();
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    }
  }

  async addAssignment(userId) {
    const fwId = document.getElementById(`assign-fw-${userId}`).value;
    if (!fwId) return;

    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, frameworkId: fwId })
      });
      if (res.ok) {
        app.showAdminDashboard();
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async removeAssignment(userId, frameworkId) {
    if (!confirm("Remove this assignment?")) return;

    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, frameworkId })
      });
      if (res.ok) {
        app.showAdminDashboard();
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

const adminDashboard = new AdminDashboard();
