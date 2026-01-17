import React from "react";

function Cards() {
  return (
    <div>
      <section class="bg-white dark:bg-gray-900 text-center">
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div>
              <div class="flex justify-center mb-4  rounded-full bg-primary-100 dark:bg-primary-900">
                <svg
                  class="w-14 h-14 text-green-500 lg:w-14 lg:h-14 dark:text-primary-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 class="mb-2 text-xl font-bold dark:text-white">Mission</h3>
              <p class="text-gray-500 dark:text-gray-400">
                To develop the innovative and creative capabilities of the
                students from within, with developmental activities, informative
                practices, and exposure to opportunities, easing their paths to
                international success
              </p>
            </div>
            <div>
              <div class="flex justify-center mb-4  rounded-full bg-primary-100 dark:bg-primary-900">
              <svg class="w-14 h-14 text-green-500 lg:w-14 lg:h-14 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
              </div>
              <h3 class="mb-2 text-xl font-bold dark:text-white">Vision</h3>
              <p class="text-gray-500 dark:text-gray-400">
                
              To provide a streamlined and transparent platform, to promote and support student innovations, and easily harness all available avenues, governmental and otherwise, to develop these ventures into global powerhouses.                                
              </p>
            </div>
            <div>
              <div class="flex justify-center mb-4  rounded-full bg-primary-100 dark:bg-primary-900">
              <svg class="w-14 h-14 text-green-500 lg:w-14 lg:h-14 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"></path></svg>
              </div>
              <h3 class="mb-2 text-xl font-bold dark:text-white">Goal</h3>
              <p class="text-gray-500 dark:text-gray-400">
              To continue our current trend of success and develop a string of new student startups and innovations that can rival the big players of the entrepreneurial environment.                                
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Cards;
