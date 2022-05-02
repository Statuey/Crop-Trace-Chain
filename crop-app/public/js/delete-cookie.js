async function deleteCookie() {
  try {
    const response = await fetch("/logout", {
      method: "post",
      body: {
        // Your body
      },
    });
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}
