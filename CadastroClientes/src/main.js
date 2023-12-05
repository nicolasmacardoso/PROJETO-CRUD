document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const cadastroLink = document.getElementById('cadastroLink');
    const entrarLink = document.getElementById('entrarLink');
    const tableTitle = document.getElementById('tableTitle');
    const mudarTabela = document.getElementById('mudarTabela');
    const cadastrarButton = document.getElementById('cadastrarButton');
    const modalCliente = document.getElementById('modalCliente');
    const fecharModalCliente = document.getElementById('fecharModalCliente');

    // Adicione essa função para limpar os campos do formulário no modal
    function limparCamposModal() {
        const camposFormulario = ['nomeCompleto', 'cpf', 'dataNascimento', 'telefone', 'celular'];
    
        camposFormulario.forEach(campo => {
            document.getElementById(campo).value = '';
        });
    }

    // Adicione essa função para abrir o modal
    function abrirModal() {
        modalCliente.style.display = 'block';
        // Adicione aqui a lógica necessária ao abrir o modal
    }

    // Adicione o evento de clique no botão "Cadastrar Novo Cliente"
    if (cadastrarButton) {
        cadastrarButton.addEventListener('click', () => {
            abrirModal();
            hideErrorMessage('clienteError');
        });
    }

    // Adicione o evento de clique no botão para fechar o modal
    if (fecharModalCliente) {
        fecharModalCliente.addEventListener('click', () => {
            fecharModal();
        });
    }

    // Adicione o evento para fechar o modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === modalCliente) {
            fecharModal();
            limparCamposModal(); // Limpar campos ao fechar o modal
        }
    });
    
    function redirectToEnderecos() {
        console.log('Redirecionando para Endereços...');
        // Lógica para abrir o formulário de cadastro de cliente
        tableTitle.textContent = 'ENDEREÇOS';
        mudarTabela.textContent = 'Clientes';
        cadastrarButton.textContent = 'Cadastrar novo endereço';
    
        enderecosTable.style.display = 'table';
        clientesTable.style.display = 'none';
    
        // Remover ouvinte de evento desnecessário
        mudarTabela.removeEventListener('click', redirectToEnderecos);
        // Adicionar ouvinte de evento após a atualização
        mudarTabela.addEventListener('click', redirectToClientes);
    
        // Outras operações necessárias ao mudar para o formulário de cadastro de cliente
    }
    
    function redirectToClientes() {
        console.log('Redirecionando para Clientes...');
        // Lógica para redirecionar para a visualização de endereços
        tableTitle.textContent = 'CLIENTES';
        mudarTabela.textContent = 'Endereços dos clientes';
        cadastrarButton.textContent = 'Cadastrar novo cliente ';
    
        clientesTable.style.display = 'table';
        enderecosTable.style.display = 'none';
    
        // Remover ouvinte de evento desnecessário
        mudarTabela.removeEventListener('click', redirectToClientes);
        // Adicionar ouvinte de evento após a atualização
        mudarTabela.addEventListener('click', redirectToEnderecos);
    
        // Outras operações necessárias ao redirecionar para a visualização de endereços
    }

    const salvarClienteButton = document.getElementById('salvarClienteButton');
    function confirmarExclusaoCliente(idCliente) {
        Swal.fire({
            title: 'Confirmação',
            text: 'Tem certeza que deseja excluir este cliente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#3f93d8',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Chame a função para excluir o cliente aqui
                excluirCliente(idCliente);
            }
        });
    }

    function adicionarIconeExcluirCliente(idCliente) {
        const tabela = document.getElementById('clientesTable');
        const tbody = tabela.querySelector('tbody');
    
        const botaoExcluir = document.createElement('button');
        botaoExcluir.className = 'btn btn-danger btn-sm';
        botaoExcluir.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/></svg>';
        botaoExcluir.addEventListener('click', () => {
            confirmarExclusaoCliente(idCliente);
        });
    
        const tdAcoes = document.createElement('td');
        tdAcoes.appendChild(botaoExcluir);
    
        const ultimaLinha = tbody.rows.length - 1;
        tbody.rows[ultimaLinha].appendChild(tdAcoes);
    }    

    // Função para excluir um cliente (a implementação desta função depende da sua lógica)
    function excluirCliente(idCliente) {
        // Adicione sua lógica para excluir o cliente do banco de dados aqui
        const deleteQuery = "DELETE FROM Clientes WHERE id = ?;";
        const stmt = db.prepare(deleteQuery);
    
        try {
            stmt.bind([idCliente]);
            stmt.step();
    
            // Verifica se alguma linha foi modificada (cliente excluído)
            const rowsModified = db.getRowsModified();
    
            if (rowsModified > 0) {
                console.log(`Cliente com ID ${idCliente} excluído com sucesso.`);
                // Recarregue a tabela após a exclusão
                carregarClientesNaTabelaHTML();
                saveDatabase();
            } else {
                console.log(`Cliente com ID ${idCliente} não encontrado.`);
            }
        } catch (error) {
            console.error(`Erro ao excluir cliente com ID ${idCliente}:`, error);
        }
    }
    // Função para adicionar ícone de lápis na tabela para atualizar os dados de um cliente
    function adicionarIconeAtualizarCliente(idCliente) {
        const tabela = document.getElementById('clientesTable');
        const tbody = tabela.querySelector('tbody');
    
        const botaoAtualizar = document.createElement('button');
        botaoAtualizar.className = 'btn btn-primary btn-sm ms-2';
        botaoAtualizar.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>';
        botaoAtualizar.addEventListener('click', () => {
            abrirModalAtualizarCliente(idCliente);
        });
    
        const tdAcoes = document.createElement('td');
        tdAcoes.appendChild(botaoAtualizar);
    
        const ultimaLinha = tbody.rows.length - 1;
        tbody.rows[ultimaLinha].appendChild(tdAcoes);
    }

    function abrirModalAtualizarCliente(idCliente) {
        // Adicione sua lógica para preencher o modal com os dados do cliente para atualização
        // e abrir o modal aqui
        console.log(`Abrir modal para atualizar dados do cliente com ID ${idCliente}`);
    }

    if (salvarClienteButton) {
        salvarClienteButton.addEventListener('click', () => {
            const nomeCompleto = document.getElementById('nomeCompleto').value;
            const cpf = document.getElementById('cpf').value;
            const dataNascimento = document.getElementById('dataNascimento').value;
            const telefone = document.getElementById('telefone').value;
            const celular = document.getElementById('celular').value;

            if (!nomeCompleto || !cpf || !dataNascimento || !celular) {
                displayErrorMessage('clienteError', 'Por favor, preencha todos os campos corretamente.');
                return;
            }

            if (!/^[a-zA-Z\s]+$/.test(nomeCompleto)) {
                displayErrorMessage('clienteError', 'Nome completo deve conter apenas letras.');
                return;
            }

            const today = new Date();
            const inputDate = new Date(dataNascimento);
            if (isNaN(inputDate.getTime()) || inputDate >= today) {
                displayErrorMessage('clienteError', 'Data de nascimento inválida.');
                return;
            }

            adicionarClienteAoBanco(nomeCompleto, cpf, dataNascimento, telefone, celular);
            adicionarClienteATabelaHTML(nomeCompleto, cpf, dataNascimento, telefone, celular);
            limparCamposModal();
            fecharModal();
            hideErrorMessage('clienteError');
        });
    }
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const celularInput = document.getElementById('celular');

    if (cpfInput) {
        cpfInput.addEventListener('input', () => {
            let value = cpfInput.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            cpfInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', () => {
            let value = telefoneInput.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            telefoneInput.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3');
        });
    }

    if (celularInput) {
        celularInput.addEventListener('input', () => {
            let value = celularInput.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            celularInput.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3');
        });
    }
    const tableBody = document.getElementById('clientesTableBody');

    const SQL = await initSqlJs({
        locateFile: filename => `../node_modules/sql.js/dist/${filename}`
    });

    let db = loadDatabase();

    function loadDatabase() {
        const savedDb = localStorage.getItem('myDatabase');
        if (savedDb) {
            console.log('Banco de dados carregado com sucesso.');
            return new SQL.Database(new Uint8Array(JSON.parse(savedDb)));
        } else {
            console.log('Criando novo banco de dados.');
            const newDb = new SQL.Database();
            initializeDatabase(newDb);
            return newDb;
        }
    }

    function saveDatabase() {
        const dbData = db.export();
        const buffer = new Uint8Array(dbData);
        const serializedDb = JSON.stringify([...buffer]);
        localStorage.setItem('myDatabase', serializedDb);
    }
    function fecharModal() {
        modalCliente.style.display = 'none';
    }
    
    if (tableBody) {
        function adicionarClienteAoBanco(nomeCompleto, cpf, dataNascimento, telefone, celular) {
            const insertQuery = `INSERT INTO Clientes (nome, cpf, dataNascimento, telefone, celular) VALUES (?, ?, ?, ?, ?);`;
            const stmt = db.prepare(insertQuery);
        
            stmt.bind([nomeCompleto, cpf, dataNascimento, telefone, celular]);
            stmt.step();     

            saveDatabase();
        }
        
        function adicionarClienteATabelaHTML(nomeCompleto, cpf, dataNascimento, telefone, celular) {
            const tableBody = document.getElementById('clientesTableBody');
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = nomeCompleto;
            newRow.insertCell(1).textContent = cpf;
            newRow.insertCell(2).textContent = dataNascimento;
            newRow.insertCell(3).textContent = telefone;
            newRow.insertCell(4).textContent = celular;
        }
        
        function carregarClientesNaTabelaHTML() {
            console.log('Iniciando carregamento de clientes na tabela HTML.');
            const tableBody = document.getElementById('clientesTableBody');
            tableBody.innerHTML = '';
        
            const selectQuery = "SELECT * FROM Clientes;";
            const stmt = db.prepare(selectQuery);
        
            while (stmt.step()) {
                const cliente = stmt.getAsObject();
                console.log('Cliente carregado na tabela HTML:', cliente.nome);
                adicionarClienteATabelaHTML(cliente.nome, cliente.cpf, cliente.dataNascimento, cliente.telefone, cliente.celular);
                adicionarIconeAtualizarCliente(cliente.id); 
                adicionarIconeExcluirCliente(cliente.id); 
            }
        
            console.log('Clientes carregados na tabela HTML.');
        }
    }
    
    if (tableBody) {
        carregarClientesNaTabelaHTML();
    }

    if (mudarTabela) {
        mudarTabela.addEventListener('click', redirectToEnderecos);
    }
    
    if (cadastroLink) {
        cadastroLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (loginForm && cadastroForm) {
                loginForm.style.display = 'none';
                cadastroForm.style.display = 'block';
            }
        });
    }

    if (entrarLink) {
        entrarLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (loginForm && cadastroForm) {
                loginForm.style.display = 'block';
                cadastroForm.style.display = 'none';
            }
        });
    }

    

    const loginButton = document.getElementById('loginButton');
    const cadastroButton = document.getElementById('cadastroButton');

    hideErrorMessage('usuarioError');
    hideErrorMessage('senhaError');
    hideErrorMessage('novoUsuarioError');
    hideErrorMessage('novaSenhaError');
    hideErrorMessage('confirmarSenhaError');
    hideErrorMessage('userExistsError');
    hideErrorMessage('userInvalidError');
    hideErrorMessage('clienteError');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const usuario = document.getElementById('usuarioInput').value;
            const senha = document.getElementById('senhaInput').value;

            if (usuario.trim() === "") {
                displayErrorMessage('usuarioError', 'Usuário não pode ser vazio.');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
                return;
            } else {
                hideErrorMessage('usuarioError');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
            }

            if (senha.trim() === "") {
                displayErrorMessage('senhaError', 'Senha não pode ser vazia.');
                return;
            } else {
                hideErrorMessage('senhaError');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
            }

            const authenticated = authenticateUser(db, usuario, senha);

            if (authenticated) {
                window.location.href = 'home.html';
            }
            else {
                displayErrorMessage('userInvalidError', 'Usuário ou senha inválido.');
            }
        });
    }
    if (cadastroButton) {
        cadastroButton.addEventListener('click', () => {
            const novoUsuarioInput = document.getElementById('novoUsuarioInput');
            const novaSenhaInput = document.getElementById('novaSenhaInput');
            const confirmarSenhaInput = document.getElementById('confirmarSenhaInput');
        
            const novoUsuario = novoUsuarioInput.value;
            const novaSenha = novaSenhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;
        
            if (novoUsuario.trim() === "") {
                displayErrorMessage('novoUsuarioError', 'Usuário não pode ser vazio.');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
                return;
            } 
        
            if (novaSenha.length < 6) {
                displayErrorMessage('novaSenhaError', 'Senha deve ter pelo menos 6 caracteres.');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
                return;
            } else {
                hideErrorMessage('novaSenhaError');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
            }
        
            if (novaSenha != confirmarSenha) {
                displayErrorMessage('confirmarSenhaError', 'Senhas não coincidem.');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
                return;
            } else {
                hideErrorMessage('confirmarSenhaError');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
            }
        
            const userCreated = createUser(db, novoUsuario, novaSenha);
        
            if (userCreated) {
                saveDatabase(); 
                console.log('Usuário cadastrado com sucesso!');
                resetFormFields([novoUsuarioInput, novaSenhaInput, confirmarSenhaInput]);
                displaySuccessMessage('cadastroSuccessMessage');
            } else {
                displayErrorMessage('userExistsError', 'Esse nome de usuário já está sendo utilizado.');
                console.log('Erro ao cadastrar usuário. Tente novamente.');
            }
        });
    }
});

function resetFormFields(fields) {
    fields.forEach(field => {
        field.value = '';
    });
}

function displaySuccessMessage(id) {
    const successElement = document.getElementById(id);
    successElement.style.display = 'block';
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 5000); 
}

function displayErrorMessage(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideErrorMessage(id) {
    const errorElement = document.getElementById(id);

    // Adicione esta verificação
    if (errorElement !== null) {
        errorElement.textContent = "";
        errorElement.style.display = 'none';
    }
}

function initializeDatabase(db) {
    const createTableEnderecos = `
        CREATE TABLE IF NOT EXISTS Enderecos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cep TEXT,
            rua TEXT,
            bairro TEXT,
            cidade TEXT,
            estado TEXT,
            pais TEXT,
            identificador_cliente INTEGER,
            principal BOOLEAN,
            FOREIGN KEY (identificador_cliente) REFERENCES Clientes(id)
        );
    `;

    // Adicione esta parte para criar a tabela de usuários
    const createTableUsuarios = `
        CREATE TABLE IF NOT EXISTS Usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE,
            senha TEXT
        );
    `;

    const createTableClientes = `
        CREATE TABLE IF NOT EXISTS Clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            cpf TEXT,
            dataNascimento TEXT,
            telefone TEXT,
            celular TEXT
        );
    `;

    db.run(createTableClientes);
    db.run(createTableEnderecos);
    db.run(createTableUsuarios);
}

function authenticateUser(db, usuario, senha) {
    const query = "SELECT * FROM Usuarios;";
    const stmt = db.prepare(query);

    while (stmt.step()) {
        const user = stmt.getAsObject();
        if (user.usuario === usuario && user.senha === senha) {
            console.log(`Usuário autenticado com sucesso! Usuário: ${usuario}, Senha: ${senha}`);
            return true;
        }
    }

    console.log(`Usuário não encontrado ou senha incorreta para: ${usuario}`);
    return false;
}

function createUser(db, usuario, senha) {
    // Lógica de cadastro de novo usuário
    const insertQuery = `INSERT INTO Usuarios (usuario, senha) VALUES (?, ?);`;
    const stmt = db.prepare(insertQuery);

    try {
        stmt.bind([usuario, senha]);
        stmt.step();
        const rowsModified = db.getRowsModified();

        if (rowsModified > 0) {
            return true; // Cadastro bem-sucedido
        } else {
            return false; // Nenhuma linha modificada, cadastro falhou
        }
    } catch (error) {
        // Tratar erro de violação de restrição única
        if (error.message.includes('UNIQUE constraint failed: Usuarios.usuario')) {
            displayErrorMessage('userExistsError', 'Nome de usuário já existe.');
        } else {
            console.error(error);
        }

        return false; // Cadastro falhou devido ao erro
    }
}
