import React from "react";
import Image from "next/image";
import styles from "./AcceptReferral.module.css";

// Pull in the Google Font the same way as before:
import { Poppins } from "next/font/google";
const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"] });

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
      <h2 className={styles.heading}>How do referrals work?</h2>

      <div className={styles.steps}>
        {/* Step 1 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <p>Download the app:</p>
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
                    width={200}
                    height={60}
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
                    width={200}
                    height={60}
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
            <p>Create an account</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
          <p>VVV Come back to this page and click here VVV</p>
            {/* The button that triggers the deep link */}
            <button className={styles.claimButton} onClick={handleClaimRewards}>
              Claim Rewards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
