function shareFoodzone(name, location) {
    const shareData = {
      title: `Check out ${name}`,
      text: `Found this awesome foodzone at ${location}!`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData)
        .catch(err => console.error('Error sharing:', err));
    } else {
      alert("Sharing not supported on this browser.");
    }
  }
