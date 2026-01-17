import React from "react";
import img1 from "../../assets/faculty/principal.jpeg"
import img2 from "../../assets/faculty/nodel.jpg"

function Faculty() {
  return (
    <div>
      <section class="bg-white dark:bg-gray-900" id="faculty">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
          <div class="mx-auto mb-8 max-w-screen-sm lg:mb-16">
            <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-800 dark:text-white">
              Faculty
            </h2>
          </div>
          <div class="grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
            <div class="text-center text-gray-500 dark:text-gray-400">
              <img
                class="mx-auto mb-4 w-48 h-48 rounded-full"
                src={img1}
                alt="Avatar"
              />
              <h3 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Dr. Riyad AM
              </h3>
              <p>Principal</p>
            </div>
            <div class="text-center text-gray-500 dark:text-gray-400">
              <img
                class="mx-auto mb-4 w-48 h-48 rounded-full"
                src={img2}
                alt="Avatar"
              />
              <h3 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Mr. MUHAMMED FAISAL T
              </h3>
              <p>Nodal Officer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Faculty;
