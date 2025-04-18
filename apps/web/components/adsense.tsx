import Script from "next/script";

/*
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6714877547689628"
     crossorigin="anonymous"></script>
<!-- dabble-ad-card -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-6714877547689628"
     data-ad-slot="3489516387"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
*/

export function AdSense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6714877547689628"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
