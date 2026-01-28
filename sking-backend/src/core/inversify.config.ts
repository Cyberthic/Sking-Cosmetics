import { Container } from "inversify";
import { TYPES } from "./types";

// Interfaces
import { IUserAuthController } from "./interfaces/controllers/user/IUserAuth.controllers";
import { IUserAuthService } from "./interfaces/services/user/IUserAuth.service";
import { IUserAuthRepository } from "./interfaces/repositories/user/IUserAuth.repository";
import { IOTPService } from "./interfaces/services/IOTP.service";
import { IJwtService } from "./interfaces/services/IJWT.service";
import { IBaseRepository } from "./interfaces/repositories/IBase.repository";
import { IEmailService } from "./interfaces/services/IEmail.service";

// Implementations
import { UserAuthController } from "../controllers/user/userAuth.controller";
import { UserAuthService } from "../services/user/userAuth.service";
import { UserAuthRepository } from "../repositories/user/userAuth.repository";
import { OTPService } from "../services/otp.service";
import { JwtService } from "../utils/jwt";
import { BaseRepository } from "../repositories/base.repository";
import { EmailService } from "../services/email.service";
import { UserProfileController } from "../controllers/user/userProfile.controller";
import { UserProfileService } from "../services/user/userProfile.service";
import { IUserProfileController } from "./interfaces/controllers/user/IUserProfile.controller";
import { IUserProfileService } from "./interfaces/services/user/IUserProfile.service";

// Admin Interfaces
import { IAdminAuthController } from "./interfaces/controllers/admin/IAdminAuth.controller";
import { IAdminAuthService } from "./interfaces/services/admin/IAdminAuth.service";
import { IAdminAuthRepository } from "./interfaces/repositories/admin/IAdminAuth.repository";
import { IAdminCustomerController } from "./interfaces/controllers/admin/IAdminCustomer.controller";
import { IAdminCustomerService } from "./interfaces/services/admin/IAdminCustomer.service";
import { IAdminCustomerRepository } from "./interfaces/repositories/admin/IAdminCustomer.repository";

// Admin Implementations
import { AdminAuthController } from "../controllers/admin/adminAuth.controller";
import { AdminAuthService } from "../services/admin/adminAuth.service";
import { AdminAuthRepository } from "../repositories/admin/adminAuth.repository";
import { AdminCustomerController } from "../controllers/admin/adminCustomer.controller";
import { AdminCustomerService } from "../services/admin/adminCustomer.service";
import { AdminCustomerRepository } from "../repositories/admin/adminCustomer.repository";
import { IAdminCategoryController } from "./interfaces/controllers/admin/IAdminCategory.controller";
import { IAdminCategoryService } from "./interfaces/services/admin/IAdminCategory.service";
import { IAdminCategoryRepository } from "./interfaces/repositories/admin/IAdminCategory.repository";
import { AdminCategoryController } from "../controllers/admin/adminCategory.controller";
import { AdminCategoryService } from "../services/admin/adminCategory.service";
import { AdminCategoryRepository } from "../repositories/admin/adminCategory.repository";

import { IAdminProductController } from "./interfaces/controllers/admin/IAdminProduct.controller";
import { IAdminProductService } from "./interfaces/services/admin/IAdminProduct.service";
import { IAdminProductRepository } from "./interfaces/repositories/admin/IAdminProduct.repository";
import { AdminProductController } from "../controllers/admin/adminProduct.controller";
import { AdminProductService } from "../services/admin/adminProduct.service";
import { AdminProductRepository } from "../repositories/admin/adminProduct.repository";

// Admin Order
import { IAdminOrderRepository } from "./interfaces/repositories/admin/IAdminOrder.repository";
import { IAdminOrderService } from "./interfaces/services/admin/IAdminOrder.service";
import { IAdminOrderController } from "./interfaces/controllers/admin/IAdminOrder.controller";
import { AdminOrderRepository } from "../repositories/admin/adminOrder.repository";
import { AdminOrderService } from "../services/admin/adminOrder.service";
import { AdminOrderController } from "../controllers/admin/adminOrder.controller";

const container = new Container();

// Repositories
container.bind<IBaseRepository<any>>(TYPES.IBaseRepository).to(BaseRepository);
container.bind<IUserAuthRepository>(TYPES.IUserAuthRepository).to(UserAuthRepository);
container.bind<IAdminAuthRepository>(TYPES.IAdminAuthRepository).to(AdminAuthRepository);
container.bind<IAdminCustomerRepository>(TYPES.IAdminCustomerRepository).to(AdminCustomerRepository);

// Controllers
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController);
container.bind<IUserProfileController>(TYPES.IUserProfileController).to(UserProfileController);
container.bind<IAdminAuthController>(TYPES.IAdminAuthController).to(AdminAuthController);
container.bind<IAdminCustomerController>(TYPES.IAdminCustomerController).to(AdminCustomerController);

// Services
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<IOTPService>(TYPES.IOTPService).to(OTPService);
container.bind<IJwtService>(TYPES.IJwtService).to(JwtService);
container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService);
container.bind<IUserProfileService>(TYPES.IUserProfileService).to(UserProfileService);
container.bind<IAdminAuthService>(TYPES.IAdminAuthService).to(AdminAuthService);
container.bind<IAdminCustomerService>(TYPES.IAdminCustomerService).to(AdminCustomerService);

// Category
container.bind<IAdminCategoryRepository>(TYPES.IAdminCategoryRepository).to(AdminCategoryRepository);
container.bind<IAdminCategoryService>(TYPES.IAdminCategoryService).to(AdminCategoryService);
container.bind<IAdminCategoryController>(TYPES.IAdminCategoryController).to(AdminCategoryController);

// Product
container.bind<IAdminProductRepository>(TYPES.IAdminProductRepository).to(AdminProductRepository);
container.bind<IAdminProductService>(TYPES.IAdminProductService).to(AdminProductService);
container.bind<IAdminProductController>(TYPES.IAdminProductController).to(AdminProductController);

// Admin Order
container.bind<IAdminOrderRepository>(TYPES.IAdminOrderRepository).to(AdminOrderRepository);
container.bind<IAdminOrderService>(TYPES.IAdminOrderService).to(AdminOrderService);
container.bind<IAdminOrderController>(TYPES.IAdminOrderController).to(AdminOrderController);



// User Product
import { IUserProductService } from "./interfaces/services/user/IUserProduct.service";
import { IUserProductRepository } from "./interfaces/repositories/user/IUserProduct.repository";
import { UserProductService } from "../services/user/userProduct.service";
import { UserProductRepository } from "../repositories/user/userProduct.repository";
import { UserProductController } from "../controllers/user/userProduct.controller";

// User Home
import { IUserHomeService } from "./interfaces/services/user/IUserHome.service";
import { UserHomeService } from "../services/user/userHome.service";
import { UserHomeController } from "../controllers/user/userHome.controller";

container.bind<IUserProductRepository>(TYPES.IUserProductRepository).to(UserProductRepository);
container.bind<IUserProductService>(TYPES.IUserProductService).to(UserProductService);
container.bind<UserProductController>(TYPES.IUserProductController).to(UserProductController);

container.bind<IUserHomeService>(TYPES.IUserHomeService).to(UserHomeService);
container.bind<UserHomeController>(TYPES.IUserHomeController).to(UserHomeController);


// Cart
import { ICartRepository } from "./interfaces/repositories/user/ICart.repository";
import { ICartService } from "./interfaces/services/user/ICart.service";
import { CartRepository } from "../repositories/user/cart.repository";
import { CartService } from "../services/user/cart.service";
import { UserCartController } from "../controllers/user/userCart.controller";

container.bind<ICartRepository>(TYPES.ICartRepository).to(CartRepository);
container.bind<ICartService>(TYPES.ICartService).to(CartService);
container.bind<UserCartController>(TYPES.IUserCartController).to(UserCartController);

// Wishlist
import { IWishlistRepository } from "./interfaces/repositories/user/IWishlist.repository";
import { IWishlistService } from "./interfaces/services/user/IWishlist.service";
import { IUserWishlistController } from "./interfaces/controllers/user/IUserWishlist.controller";
import { WishlistRepository } from "../repositories/user/wishlist.repository";
import { WishlistService } from "../services/user/wishlist.service";
import { UserWishlistController } from "../controllers/user/userWishlist.controller";

container.bind<IWishlistRepository>(TYPES.IWishlistRepository).to(WishlistRepository);
container.bind<IWishlistService>(TYPES.IWishlistService).to(WishlistService);
container.bind<IUserWishlistController>(TYPES.IUserWishlistController).to(UserWishlistController);

// User Category
import { IUserCategoryRepository } from "./interfaces/repositories/user/IUserCategory.repository";
import { IUserCategoryService } from "./interfaces/services/user/IUserCategory.service";
import { UserCategoryRepository } from "../repositories/user/userCategory.repository";
import { UserCategoryService } from "../services/user/userCategory.service";
import { UserCategoryController } from "../controllers/user/userCategory.controller";

container.bind<IUserCategoryRepository>(TYPES.IUserCategoryRepository).to(UserCategoryRepository);
container.bind<IUserCategoryService>(TYPES.IUserCategoryService).to(UserCategoryService);
container.bind<UserCategoryController>(TYPES.UserCategoryController).to(UserCategoryController);

// User Address
import { IUserAddressRepository } from "./interfaces/repositories/user/IUserAddress.repository";
import { IUserAddressService } from "./interfaces/services/user/IUserAddress.service";
import { UserAddressRepository } from "../repositories/user/userAddress.repository";
import { UserAddressService } from "../services/user/userAddress.service";
import { UserAddressController } from "../controllers/user/userAddress.controller";

container.bind<IUserAddressRepository>(TYPES.IUserAddressRepository).to(UserAddressRepository);
container.bind<IUserAddressService>(TYPES.IUserAddressService).to(UserAddressService);
container.bind<UserAddressController>(TYPES.IUserAddressController).to(UserAddressController);

// User Checkout
import { IUserCheckoutRepository } from "./interfaces/repositories/user/IUserCheckout.repository";
import { IUserCheckoutService } from "./interfaces/services/user/IUserCheckout.service";
import { IUserCheckoutController } from "./interfaces/controllers/user/IUserCheckout.controller";
import { UserCheckoutRepository } from "../repositories/user/userCheckout.repository";
import { UserCheckoutService } from "../services/user/userCheckout.service";
import { UserCheckoutController } from "../controllers/user/userCheckout.controller";

container.bind<IUserCheckoutRepository>(TYPES.IUserCheckoutRepository).to(UserCheckoutRepository);
container.bind<IUserCheckoutService>(TYPES.IUserCheckoutService).to(UserCheckoutService);
container.bind<IUserCheckoutController>(TYPES.IUserCheckoutController).to(UserCheckoutController);

// User Order
import { IUserOrderRepository } from "./interfaces/repositories/user/IUserOrder.repository";
import { IUserOrderService } from "./interfaces/services/user/IUserOrder.service";
import { IUserOrderController } from "./interfaces/controllers/user/IUserOrder.controller";
import { UserOrderRepository } from "../repositories/user/userOrder.repository";
import { UserOrderService } from "../services/user/userOrder.service";
import { UserOrderController } from "../controllers/user/userOrder.controller";

container.bind<IUserOrderRepository>(TYPES.IUserOrderRepository).to(UserOrderRepository);
container.bind<IUserOrderService>(TYPES.IUserOrderService).to(UserOrderService);
container.bind<IUserOrderController>(TYPES.IUserOrderController).to(UserOrderController);

export { container };
export default container;
