import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";

import AddressesRepository from "../repository/AddressesRepository";
import IAddressesRepository from "../repository/IAddressesRepository";
import IUsersRepository from "../repository/IUsersRepository";
import UsersRepository from "../repository/UsersRepository";
import { CustomRequest } from "../routes/AuthenticationRoutes";
import Authentication from "../ucs/UCAuthentication";

export default class UsersController {
  private usersRepository: IUsersRepository;
  private addrRepository: IAddressesRepository;
  private ucAuth: Authentication;

  constructor() {
    this.usersRepository = new UsersRepository();
    this.addrRepository = new AddressesRepository();
    this.ucAuth = new Authentication(this.usersRepository, this.addrRepository);
  }

  saveUser = (req: Request, res: Response, next: NextFunction) => {
    return this.ucAuth.registerUser(req.body).then(result => res.send(result)).catch(err => next(new HttpException(400, err.message)));
  }

  login = (req: Request, res: Response, next: NextFunction) => {
    return this.ucAuth.login(req.body.email, req.body.password).then(result => res.send(result))
      .catch(err => next(new HttpException(401, err.message)));
  }

  getUserInfo = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.token as JwtPayload;


    return this.ucAuth.getUserInfo(token._id)
      .then(result => res.send(result)).catch(err => next(new HttpException(401, err.message)));
  }

  updateUserInfo = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.token as JwtPayload;

    return this.ucAuth.updateUserInfo(token._id, req.params.id, req.body)
      .then(result => res.send(result)).catch(err => next(new HttpException(401, err.message)));
  }

  removeUser = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.token as JwtPayload;
    return this.ucAuth.removeUser(token._id, req.params.id).then(result => res.send(result))
      .catch(err => next(new HttpException(400, err.message)));
  }
}