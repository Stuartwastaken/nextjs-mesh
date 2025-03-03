import React from "react";
import Image from "next/image";
import styles from "./AcceptReferral.module.css";

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
      `name=${name}&` +
      `userRef=${userRef}&` +
      `referralHash=${referralHash}`;

    // On click, attempt to open the app via deep link:
    window.location.href = deepLinkURL;
  };

  return (
    <div className={`${styles.container} ${poppins.className}`}>

      
      <div className={styles.heroSection}>
        <h1 className={styles.heading}>Meet New Friends Over Coffee</h1>
        <p className={styles.subheading}>
          Join friendly groups of 4 at local coffee shops every Saturday morning
        </p>
        
        <div className={styles.highlightBox}>
          <div className={styles.highlightIcon}>☕</div>
          <div className={styles.highlightContent}>
           <p>Make meaningful connections in a relaxed, safe environment.</p>
          </div>
        </div>
      </div>

      <div className={styles.steps}>
        {/* Step 1 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Download Mesh</h3>
            <p>Get the app that&apos;s connecting people in your city</p>
            <div className={styles.storeLinks}>
              <div className={styles.imgWrapper}>
                <a
                  href="https://apps.apple.com/us/app/mesh-four-people-together/id6446823257"
                  target="_blank"
                  rel="noopener noreferrer"
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

        {/* Step 2 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Create Your Profile</h3>
            <p>Tell us about yourself and your interests so we can match you with the perfect group</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Verify & Unlock Benefits</h3>
            <p>Return to this page after creating your account and click below to:</p>
            <ul className={styles.benefitsList}>
              <li>
                <span className={styles.benefitIcon}>🎁</span>
                <span>Send a reward to <strong>{name && name.trim() ? name : 'your friend'}</strong> for inviting you</span>
              </li>
              <li>
                <span className={styles.benefitIcon}>✨</span>
                <span>Unlock your 2-week free trial of Mesh</span>
              </li>
              <li>
                <span className={styles.benefitIcon}>☕</span>
                <span>Get your first invite to a Saturday coffee meetup</span>
              </li>
            </ul>
            {/* The button that triggers the deep link */}
            <button className={styles.claimButton} onClick={handleClaimRewards}>
              Verify Referral & Claim Benefits
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.featureSection}>
        <h2 className={styles.featureSectionHeading}>How Mesh Works</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>👋</div>
            <h3>Meet in Person</h3>
            <p>Connect with 3 other people at local coffee shops</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🕙</div>
            <h3>Every Saturday at 10am</h3>
            <p>Regular meetups make it easy to fit into your schedule</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🏙️</div>
            <h3>Local Community</h3>
            <p>Meet people who live in your neighborhood</p>
          </div>
        </div>
      </div>
      
      <div className={styles.testimonialSection}>
        <h2 className={styles.testimonialHeading}>Real Connections, Real Stories</h2>
        <div className={styles.testimonials}>
          <div className={styles.testimonial}>
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
          <div className={styles.testimonial}>
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
      
      <div className={styles.ctaSection}>
        <h2>Ready to meet new friends over coffee?</h2>
        <p>Download the app now and establish roots in your community!</p>
        <button className={styles.mainCTAButton} onClick={handleClaimRewards}>
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
