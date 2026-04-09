const archiver = require("archiver");
const { generatePayslipPdf, getPayslipFilename } = require("./pdfService");

const streamPayrollZip = async ({ payrolls, res }) => {
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  return new Promise(async (resolve, reject) => {
    archive.on("error", reject);
    res.on("close", resolve);
    archive.pipe(res);

    try {
      // ✅ FIXED (parallel)
      const pdfBuffers = await Promise.all(
        payrolls.map(async (payroll) => {
          const pdfBuffer = await generatePayslipPdf(payroll);
          return {
            buffer: pdfBuffer,
            filename: getPayslipFilename(payroll),
          };
        })
      );

      pdfBuffers.forEach(({ buffer, filename }) => {
        archive.append(buffer, { name: filename });
      });

      await archive.finalize();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  streamPayrollZip,
};
