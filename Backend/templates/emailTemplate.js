const baseTemplate = (content) => {
  return `
  <div style="font-family: Arial; background:#f4f4f4; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px;">

      <h2>EMS HR Portal</h2>

      <hr />

      ${content}

      <hr />

      <p style="font-size:12px;color:gray;">
        Automated email - do not reply
      </p>

    </div>
  </div>
  `;
};

module.exports = { baseTemplate };