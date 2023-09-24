import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioEntity } from './usuario.entity';
import {v4 as uuid} from 'uuid'
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
@Controller('/usuarios')
export class UsuarioController {
  constructor(private usuarioRepository: UsuarioRepository) {}

  @Post()
  async criaUsuario(@Body() dadosDoUsuario: CriaUsuarioDTO) {
    const usuario=new UsuarioEntity();
    usuario.email=dadosDoUsuario.email,
    usuario.senha=dadosDoUsuario.senha,
    usuario.nome=dadosDoUsuario.nome
    usuario.id=uuid()
    this.usuarioRepository.salvar(usuario);
    return{
      message:'Usuario criado com sucesso',
      usuarioLista:new ListaUsuarioDTO(usuario.id,usuario.nome)
    }
  }

  @Get()
  async listUsuarios() {
   const usuariosSalvos=await this.usuarioRepository.listar();
   const usuariosLista=usuariosSalvos.map(
    usuario=>new ListaUsuarioDTO(
      usuario.id,
      usuario.nome
      )
   );
   return usuariosLista;
  }
  @Put('/:id')
  async atualizaUsuario(@Param('id') id: string,@Body() novosDados:AtualizaUsuarioDTO){
    const usuarioAtualizado=await this.usuarioRepository.atualizaUsuario(id,novosDados);
    return{
      usuario:usuarioAtualizado,
      message:'usuario atualizado com sucesso!'
    }
  }
@Delete('/:id')
  async removeUsuario(@Param('id') id:string){
    const usuarioRemovido=await this.usuarioRepository.removeUsuario(id);
    return{
      usuario:usuarioRemovido,
      message:'usuario removido com sucesso'
    }
  }
}
