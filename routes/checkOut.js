{{>header page="page"}}
{{>hero}}
<!-- Breadcrumb Section Begin -->
<section class="breadcrumb-section set-bg" data-setbg="img/breadcrumb.jpg">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <div class="breadcrumb__text">
                    <h2>Thanh Toán</h2>
                    <div class="breadcrumb__option">
                        <a href="/">Trang Chủ</a>
                        <span>Thanh Toán</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Breadcrumb Section End -->

<!-- Checkout Section Begin -->
<section class="checkout spad">
    <div class="container">
        {{!-- <div class="row">
            <div class="col-lg-12">
                <h6><span class="icon_tag_alt"></span> Have a coupon? <a href="#">Click here</a> to enter your code
                </h6>
            </div>
        </div> --}}
        <div class="checkout__form">
            <h4>Hóa đơn chi tiết</h4>
            <form id="formCheckout" action="/checkout" method="POST">
                <div class="row">
                    <div class="col-lg-8 col-md-6">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="checkout__input">
                                    <p>Họ và tên <span>*</span></p>
                                    <input type="text" value="{{user.name}}" readonly>
                                </div>
                            </div>

                        </div>

                        <div class="checkout__input">
                            <p>Địa chỉ<span>*</span></p>
                            <input type="text" value="{{user.address}}" placeholder="Địa chỉ nhà"
                                class="checkout__input__add" readonly>

                        </div>

                        <div class="row">
                            <div class="col-lg-6">
                                <div class="checkout__input">
                                    <p>Số điện thoại<span>* {{#if errorNumberPhone}}
                                            Bạn nhập sai số điện thoại {{/if}}</span></p>
                                    <input type="tel" name="numberPhone">
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="checkout__input">
                                    <p>Email<span>*</span></p>
                                    <input type="text" name="emailUser" value="{{user.email}}" readonly>
                                </div>
                            </div>
                        </div>

                        <div class="checkout__input">
                            <p>Ghi chú</p>
                            <input type="text" name="note" placeholder="Thông tin cần lưu ý">
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="checkout__order" style="padding: 25px; border-radius: 15px;">
                            <h4>Đơn đặt hàng</h4>
                            <div class="checkout__order__products">Sản phẩm <span>Giá</span></div>
                            <ul>
                                {{#each listProductOrder}}
                                <li>{{this.name}} <span>{{format this.sumPriceProduct}}</span></li>

                                {{/each}}
                            </ul>

                            <div class="checkout__order__total">Tổng <span>{{format sumPrice}}</span></div>

                            <div>
                                <button style="border-radius: 10px;" type="submit" onclick="postCheckout()"
                                    data-toggle="modal" data-target="#notification" class="site-btn">Đặt
                                    hàng</button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>

        </div>
    </div>
</section>
<!-- Checkout Section End -->
<button id="errorListProduct" style="display: none" data-toggle="modal" data-target="#notification"></button>
<!-- Modal -->
<div class="modal fade" id="notification" tabindex="-1" role="dialog" aria-labelledby="notification-label"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="notification-label">Thông báo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="notify">
                Bạn chờ chút nhé!
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="fixHtml()">Ok</button>

            </div>
        </div>
    </div>
</div>
{{#section 'script'}}
<script>
    function postCheckout() {
        let data = $('#formCheckout').serializeArray();
        console.log(data);
    }
</script>
{{#if errorListProduct}}
<script>
    async function errorListProduct() {
        $("#notify").html(`Danh sánh đặt hàng trống!!`)
        $('#notification').modal('show');
        return true;
    }
    function fixHtml() {
        $("#notify").html(`Bạn chờ chút nhé!`)
    }
    errorListProduct();
</script>
{{/if}}

{{#if errorNumberPhone}}
<script>
    async function errorNumberPhone() {
        $("#notify").html(`Bạn nhập sai số điện thoại!!`)
        $('#notification').modal('show');
        return true;
    }
    function fixHtml() {
        $("#notify").html(`Bạn chờ chút nhé!`)
    }
    errorNumberPhone();
</script>
{{/if}}
{{/section}}