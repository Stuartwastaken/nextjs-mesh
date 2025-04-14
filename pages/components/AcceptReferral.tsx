import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./AcceptReferral.module.css";
import { initScrollAnimations, addAnimationDelays } from "../../utils/ScrollAnimations";

// Import Google Fonts with additional weights
import { Poppins } from "next/font/google";
const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700"], 
  subsets: ["latin"],
  display: 'swap'
});

// Define the props we need for the referral deep link:
type AcceptReferralProps = {
  name: string;
  userRef: string;
  referralHash: string;
};

export default function AcceptReferral({
  name,
  userRef,
  referralHash,
}: AcceptReferralProps) {
  // This button explicitly triggers the deep link:
  const handleClaimRewards = () => {
    const deepLinkURL =
      `mesh://meshapp.us/acceptReferral?` +
      `name=${encodeURIComponent(name || '')}` +
      `&userRef=${encodeURIComponent(userRef)}` +
      `&referralHash=${encodeURIComponent(referralHash)}`;

    // On click, attempt to open the app via deep link:
    window.location.href = deepLinkURL;
  };

  // Initialize scroll animations on component mount
  useEffect(() => {
    initScrollAnimations();
    addAnimationDelays();
  }, []);

  const friendName = name || 'Your friend';

  return (
    <div className={`${styles.container} ${poppins.className}`}>
      
      <div className={styles.heroSection}>
        <h1 className={styles.heading}>You&apos;re Invited to Mesh!</h1>
        <p className={styles.subheading}>
          Join friends for coffee meetups every Saturday.
        </p>
        
        <div className={styles.highlightBox}>
          <div className={styles.highlightIcon}>💌</div>
          <div className={styles.highlightContent}>
           <p><strong>{friendName}</strong> invited you to join Mesh!</p>
          </div>
        </div>
      </div>

      {/* --- NEW CORE ACTION SECTION --- */}
      <div className={styles.coreActions}>

        {/* Step 1: Download & Setup */}
        <div className={styles.actionStep} id="action-step-1">
           <div className={styles.stepNumber}>1</div>
           <div className={styles.actionContent}>
            <h2 className={styles.actionTitle}>Get the App</h2>
            <p className={styles.actionDescription}>First, download Mesh and <strong>create your profile</strong> in the app.</p>
            <div className={styles.storeLinks}>
              <div className={styles.imgWrapper}>
                <a
                  href="https://apps.apple.com/us/app/mesh-four-people-together/id6446823257"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                >
                  <Image
                    src="/app_store_logo.png"
                    alt="Download on the App Store"
                    width={180}
                    height={55}
                    className={styles.croppedImage}
                  />
                </a>
              </div>

              <div className={styles.imgWrapper}>
                <a
                  href="https://play.google.com/store/apps/details?id=com.mycompany.mesh&hl=en_US&gl=US&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get it on Google Play"
                >
                  <Image
                    src="/google_play_logo.png"
                    alt="Get it on Google Play"
                    width={180}
                    height={55}
                    className={styles.croppedImage}
                  />
                </a>
              </div>
            </div>
           </div>
        </div>

        {/* Step 2: Verify */}
        <div className={styles.actionStep} id="action-step-2">
           <div className={styles.stepNumber}>2</div>
           <div className={styles.actionContent}>
            <h2 className={styles.actionTitle}>Verify Your Referral & Add as a Friend</h2>
            <p className={styles.actionDescription}>
              <strong>Important:</strong> After creating your profile in the app, <strong>return to this page</strong> and tap the button below.
            </p>
            <button
              className={styles.claimButton} // Reuse existing style, maybe enhance later
              onClick={handleClaimRewards}
              aria-label="Verify referral and claim benefits"
            >
              Verify Referral & Claim Benefits
            </button>
             <ul className={styles.benefitsListSmall}>
                <li>
                    <span className={styles.benefitIconSmall}>🎁</span>
                    <span>Sends a reward to <strong>{friendName}</strong></span>
                </li>
                <li>
                    <span className={styles.benefitIconSmall}>✨</span>
                    <span>Unlocks your 2-week free trial</span>
                </li>
                <li>
                    <span className={styles.benefitIconSmall}>☕</span>
                    <span>Gets your first coffee meetup invite</span>
                </li>
            </ul>
           </div>
        </div>
      </div>
      {/* --- END NEW CORE ACTION SECTION --- */}
      
      <div className={styles.featureSection}>
        <h2 className={styles.featureSectionHeading}>How Mesh Works</h2>
        <div className={styles.features}>
          <div className={styles.feature} id="feature-1">
            <div className={styles.featureIcon}>👋</div>
            <h3>Meet in Person</h3>
            <p>Connect with 3 other people at local coffee shops</p>
          </div>
          <div className={styles.feature} id="feature-2">
            <div className={styles.featureIcon}>🕙</div>
            <h3>Every Saturday at 10am</h3>
            <p>Regular meetups make it easy to fit into your schedule</p>
          </div>
          <div className={styles.feature} id="feature-3">
            <div className={styles.featureIcon}>🏙️</div>
            <h3>Local Community</h3>
            <p>Meet people who live in your neighborhood</p>
          </div>
        </div>
      </div>
      
      <div className={styles.testimonialSection}>
        <h2 className={styles.testimonialHeading}>Real Connections, Real Stories</h2>
        <div className={styles.testimonials}>
          <div className={styles.testimonial} id="testimonial-1">
            <div className={styles.testimonialHeader}>
              <div className={styles.profileImageContainer}>
                <Image 
                  src="/marketing_referral_1.jpeg" 
                  alt="Sarah J." 
                  width={80} 
                  height={80}
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.testimonialMeta}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.testimonialAuthor}>Sarah J.</div>
              </div>
            </div>
            <p>&quot;I was new to the city and Mesh connected me with amazing people at my local coffee shop. We still meet up every month!&quot;</p>
          </div>
          <div className={styles.testimonial} id="testimonial-2">
            <div className={styles.testimonialHeader}>
              <div className={styles.profileImageContainer}>
                <Image 
                  src="/marketing_referral_2.jpeg" 
                  alt="Caitlyn O." 
                  width={80} 
                  height={80}
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.testimonialMeta}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.testimonialAuthor}>Caitlyn O.</div>
              </div>
            </div>
            <p>&quot;Saturday coffee meetups have become the highlight of my week. I&apos;ve made genuine friends through Mesh!&quot;</p>
          </div>
        </div>
      </div>
      
      <div className={styles.ctaSection} id="cta-section">
        <h2>Ready to meet new friends over coffee?</h2>
        <p>Download the app now and establish roots in your community!</p>
        <button
          className={styles.mainCTAButton}
          onClick={() => document.getElementById('action-step-1')?.scrollIntoView({ behavior: 'smooth' })} // Scrolls up to download links
          aria-label="Get started with Mesh"
        >
          Get Started Now
        </button>
      </div>
      
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Mesh. All rights reserved.</p>
        <p className={styles.footerLinks}>
          <a href="https://www.mesh-local.com/privacy-policy">Privacy Policy</a> | <a href="https://www.mesh-local.com/terms-of-service">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
