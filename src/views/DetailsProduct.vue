<template>
    <!-- =======================
Main Banner START -->
    <section class="position-relative">

        <!-- Svg decoration -->
        <div class="position-absolute top-50 start-0 translate-middle-y d-none d-md-block">
            <img src="@/assets/images/element/decoration.svg" alt="">
        </div>

        <div class="container">
            <!-- Content and Image START -->
            <div class="row g-4 g-lg-5 align-items-center">
                <!-- Content -->
                <div class="col-lg-6 position-relative">
                    <h6 class="text-uppercase">🤩 Easy Way To Conform Ticket</h6>
                    <!-- Title -->
                    <h1 class="mb-2">Book Your Tour Ticket Now!</h1>
                    <!-- Info -->
                    <p class="mb-4">Speedily say has suitable disposal add boy. On forth doubt miles of child. Exercise
                        joy man children rejoiced.</p>

                    <!-- Form START -->
                    <form class="row g-4">
                        <!-- Destination -->
                        <div class="col-12">
                            <label class="small">Destination</label>
                            <div class="form-border-bottom form-control-transparent d-flex align-items-center">
                                <div class="flex-shrink-0 me-2">
                                    <!-- Icon -->
                                    <i class="bi bi-geo-alt text-secondary d-block"></i>
                                </div>
                                <!-- Input field -->
                                <div class="flex-grow-1">
                                    <!-- Cities -->
                                    <div class="form-fs-lg">
                                        <select class="form-select js-choice h5" data-search-enabled="true"
                                            aria-label=".form-select-sm">
                                            <option value="">Select location</option>
                                            <option>San Jacinto, USA</option>
                                            <option>North Dakota, Canada</option>
                                            <option>West Virginia, Paris</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Check in -->
                        <div class="col-md-6">
                            <label class="small">Check in</label>
                            <div class="form-border-bottom form-control-transparent d-flex align-items-center">
                                <!-- Icon -->
                                <i class="bi bi-calendar text-secondary d-block me-2"></i>
                                <!-- Cities -->
                                <div class="form-fs-lg">
                                    <input type="text" class="form-control flatpickr" data-date-format="d/M/Y"
                                        placeholder="Select Date">
                                </div>
                            </div>
                        </div>

                        <!-- Check Out -->
                        <div class="col-md-6">
                            <label class="small">Check Out</label>
                            <div class="form-border-bottom form-control-transparent d-flex align-items-center">
                                <!-- Icon -->
                                <i class="bi bi-calendar text-secondary d-block me-2"></i>
                                <!-- Cities -->
                                <div class="form-fs-lg">
                                    <input type="text" class="form-control flatpickr" data-date-format="d/M/Y"
                                        placeholder="Select Date">
                                </div>
                            </div>
                        </div>

                        <!-- Occupant -->
                        <div class="col-md-6">
                            <label class="small">Occupant</label>
                            <div class="form-border-bottom form-control-transparent d-flex align-items-center">
                                <!-- Icon -->
                                <i class="fa-solid fa-user-group text-secondary d-block me-2"></i>
                                <!-- Cities -->
                                <div class="form-fs-lg">
                                    <div class="dropdown guest-selector me-2">
                                        <input type="text" class="form-guest-selector form-control selection-result"
                                            placeholder="Select occupant" id="dropdownShare"
                                            data-bs-auto-close="outside" data-bs-toggle="dropdown">

                                        <!-- dropdown items -->
                                        <ul class="dropdown-menu guest-selector-dropdown"
                                            aria-labelledby="dropdownShare">
                                            <!-- Adult -->
                                            <li class="d-flex justify-content-between">
                                                <div>
                                                    <h6 class="mb-0">Adults</h6>
                                                    <small>Ages 13 or above</small>
                                                </div>

                                                <div class="hstack gap-1 align-items-center">
                                                    <button type="button" class="btn btn-link adult-remove p-0 mb-0"><i
                                                            class="bi bi-dash-circle fs-5 fa-fw"></i></button>
                                                    <h6 class="guest-selector-count mb-0 adults">2</h6>
                                                    <button type="button" class="btn btn-link adult-add p-0 mb-0"><i
                                                            class="bi bi-plus-circle fs-5 fa-fw"></i></button>
                                                </div>
                                            </li>

                                            <!-- Divider -->
                                            <li class="dropdown-divider"></li>

                                            <!-- Child -->
                                            <li class="d-flex justify-content-between">
                                                <div>
                                                    <h6 class="mb-0">Child</h6>
                                                    <small>Ages 13 below</small>
                                                </div>

                                                <div class="hstack gap-1 align-items-center">
                                                    <button type="button" class="btn btn-link child-remove p-0 mb-0"><i
                                                            class="bi bi-dash-circle fs-5 fa-fw"></i></button>
                                                    <h6 class="guest-selector-count mb-0 child">0</h6>
                                                    <button type="button" class="btn btn-link child-add p-0 mb-0"><i
                                                            class="bi bi-plus-circle fs-5 fa-fw"></i></button>
                                                </div>
                                            </li>

                                            <!-- Divider -->
                                            <li class="dropdown-divider"></li>

                                            <!-- Rooms -->
                                            <li class="d-flex justify-content-between">
                                                <div>
                                                    <h6 class="mb-0">Rooms</h6>
                                                    <small>Max room 8</small>
                                                </div>

                                                <div class="hstack gap-1 align-items-center">
                                                    <button type="button" class="btn btn-link room-remove p-0 mb-0"><i
                                                            class="bi bi-dash-circle fs-5 fa-fw"></i></button>
                                                    <h6 class="guest-selector-count mb-0 rooms">1</h6>
                                                    <button type="button" class="btn btn-link room-add p-0 mb-0"><i
                                                            class="bi bi-plus-circle fs-5 fa-fw"></i></button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tour type -->
                        <div class="col-md-6">
                            <label class="small">Tour type</label>
                            <div class="form-border-bottom form-control-transparent d-flex align-items-center">
                                <div class="flex-shrink-0 me-2">
                                    <!-- Icon -->
                                    <i class="fa-solid fa-torii-gate text-secondary d-block"></i>
                                </div>
                                <!-- Input field -->
                                <div class="flex-grow-1">
                                    <!-- Cities -->
                                    <div class="form-fs-lg">
                                        <select class="form-select js-choice h5" data-search-enabled="true"
                                            aria-label=".form-select-sm">
                                            <option value="">Select type</option>
                                            <option>Adventure</option>
                                            <option>Beach</option>
                                            <option>Desert</option>
                                            <option>History</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button -->
                        <div class="col-12">
                            <button class="btn btn-primary w-100 mb-0">Check Availability</button>
                        </div>
                    </form>
                    <!-- Form END -->
                </div>

                <!-- Image -->
                <div class="col-lg-6 position-relative">
                    <img src="@/assets/images/bg/09.jpg" class="rounded" alt="">
                </div>
            </div>
            <!-- Content and Image END -->
        </div>
    </section>
    <!-- =======================
Main Banner END -->


</template>