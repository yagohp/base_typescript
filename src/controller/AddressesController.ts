import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";

import AddressesRepository from "../repository/AddressesRepository";
import IAddressesRepository from "../repository/IAddressesRepository";
import IUsersRepository from "../repository/IUsersRepository";
import UsersRepository from "../repository/UsersRepository";
import { CustomRequest } from "../routes/AuthenticationRoutes";
import UCAddresses from "../ucs/UCAddresses";

export default class AddressesController {
    private usersRepository: IUsersRepository;
    private addressRepository: IAddressesRepository;
    private addrUseCase: UCAddresses;

    constructor() {
        this.usersRepository = new UsersRepository();
        this.addressRepository = new AddressesRepository();
        this.addrUseCase = new UCAddresses(this.usersRepository, this.addressRepository);
    }

    saveAddress = (req: CustomRequest, res: Response, next: NextFunction) => {
        const token = req.token as JwtPayload;
        return this.addrUseCase.insertAddress(token._id, req.body).then(result => res.send(result))
            .catch(err => next(new HttpException(400, err.message)));
    }

    updateAddress = (req: CustomRequest, res: Response, next: NextFunction) => {
        const token = req.token as JwtPayload;
        return this.addrUseCase.updateAddress(token._id, req.params.id, req.body).then(result => res.send(result))
            .catch(err => next(new HttpException(400, err.message)));
    }

    removeAddress = (req: CustomRequest, res: Response, next: NextFunction) => {
        const token = req.token as JwtPayload;
        return this.addrUseCase.removeAddress(token._id, req.params.id).then(result => res.send(result))
            .catch(err => next(new HttpException(400, err.message)));
    }

    getSingleAddress = (req: CustomRequest, res: Response, next: NextFunction) => {
        const token = req.token as JwtPayload;
        return this.addrUseCase.getAddress(token._id, req.params.id).then(result => res.send(result))
            .catch(err => next(new HttpException(400, err.message)));
    }

    getAllAddresses = (req: CustomRequest, res: Response, next: NextFunction) => {
        const token = req.token as JwtPayload;
        const country = req.query.country as string || '';
        return this.addrUseCase.getUserAddresses(token._id, country).then(result => res.send(result))
            .catch(err => next(new HttpException(400, err.message)));
    }
}