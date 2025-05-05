export default function BenefitsSection() {
    return(
        <section className="bg-blue-50 py-16 px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <div>
                <h3 className="text-xl font-semibold">Centralize Feedbacks</h3>
                <p className="mt-2 text-gray-600">Tenha todos os comentários em um só lugar.</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold">Reduza Retrabalho</h3>
                <p className="mt-2 text-gray-600">Evite confusão com revisões dispersas.</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold">Colabore com Facilidade</h3>
                <p className="mt-2 text-gray-600">Trabalhe com times e clientes com clareza.</p>
            </div>
            </div>
        </section>
    )
    }