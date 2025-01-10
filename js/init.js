window.AppReady = new Promise(async (resolve) => {
  Object.assign(
    window,
    {
      // defines
      values: {
        AppName: "株式会社DeepDive | コーポレートサイト",
        Copyright: `© ${new Date().getFullYear()} DeepDive, Inc.`,
      },
      // util
      log: console.log,
      assert: console.assert,
      sleep: (msec) => new Promise((resolve) => setTimeout(resolve, msec)),
    }
  );
  window.dispatchEvent(new Event("sync"));
  resolve();
});


